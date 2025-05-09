import InputErrorMessage from '@/components/InputErrorMessage';
import MultiSelectionDropDown from '@/components/Inputs/MultiSelectionDropDown';
import { StyledModalHeader } from '@/styles/common';
import {
  Button,
  Col,
  FormCheck,
  FormControl,
  Modal,
  Row,
} from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Option from '@/models/option';
import React, { useCallback, useEffect, useState } from 'react';
import {
  checkGroupNameExits,
  getGroupById,
  updateGroup,
} from '@admin/services/group.service';
import DropdownInput from '@/components/Inputs/DropdownInput';
import { groupTypeOptions } from '@admin/enums/group-type';
import DefinedErrorMessage from '@/constants/message';
import { useNotification } from '@/providers/NotificationProvider';
import { getUsersByCompanyIds } from '@admin/services/user.service';
import HalfDateInput from '@/components/Inputs/NumberInput/HalfDateInput';

type Props = {
  groupId: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  companyOptions: Option[];
  fetchGroups: () => void;
  resetSelectedGroupId: () => void;
};

function EditUserGroupModal({
  groupId,
  showModal,
  setShowModal,
  companyOptions,
  fetchGroups,
  resetSelectedGroupId,
}: Props) {
  const notification = useNotification();
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    setError,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      companyIds: [],
      userIds: [],
      active: false,
    },
    mode: 'all',
  });

  const selectedCompanyIds = useWatch({ control, name: 'companyIds' });

  const onCompaniesChange = useCallback((value: any) => {
    if (!value?.length) {
      setValue('userIds', []);
      setUserOptions([]);
      return;
    }

    getUsers(value);
  }, []);

  const getUsers = useCallback((value: any) => {
    if (!value?.length) {
      return;
    }

    getUsersByCompanyIds(value)
      .then((data) => {
        const userOptions = data.map((user: any) => {
          return {
            value: user.id,
            displayValue: user.name,
          };
        });
        setUserOptions(userOptions);

        const userIds = getValues('userIds');
        const selectedUserIds = userIds.filter((id: any) =>
          userOptions.find((user: any) => user.value === id),
        );

        setValue('userIds', selectedUserIds);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onClose = () => {
    setShowModal(false);
  };
  const onSubmit = handleSubmit((data) => {
    setIsUpdating(true);
    updateGroup(groupId, data)
      .then(() => {
        onClose();
        fetchGroups();
        notification.showInfo(
          'User Group edited successfully.',
          'success',
          3000,
        );
      })
      .catch((error) => {
        console.log(error);
        notification.showError(error.status, 'Failed to update group.');
      })
      .finally(() => {
        resetSelectedGroupId();
        setIsUpdating(false);
      });
  });

  useEffect(() => {
    getGroupById(groupId)
      .then((data) => {
        reset(data);
        getUsers(data.companyIds);
      })
      .catch((error) => {
        console.log(error);
        notification.showError(error.status, 'Failed to get group.');
      });
  }, [groupId]);

  const validateGroupName = useCallback((e: any, groupId: string) => {
    const name = e?.target?.value?.trim();

    if (!name) {
      setError('name', {
        type: 'Required',
        message: DefinedErrorMessage.REQUIRED_MESSAGE,
      });
      setValue('name', '');
      return false;
    }

    setValue('name', name);
    checkGroupNameExits(name, groupId).then((data) => {
      if (data.exists) {
        setError('name', {
          type: 'Existed',
          message: DefinedErrorMessage.NAME_EXISTS_MESSAGE,
        });
        return false;
      }

      return true;
    });
  }, []);

  return (
    <Modal
      data-testid="edit-group-modal"
      show={showModal}
      onHide={onClose}
      onExited={() => reset()}
      centered
      className="modal-blur fade"
      size="lg"
    >
      <StyledModalHeader closeButton closeVariant="white">
        <Modal.Title>Edit User Group</Modal.Title>
      </StyledModalHeader>
      <Modal.Body>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">Group Name</label>
          <Col>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <FormControl
                      type="text"
                      className={!!errors.name ? 'is-invalid' : ''}
                      autoComplete="off"
                      placeholder="Enter group name here"
                      maxLength={250}
                      {...field}
                      onBlur={(e) => validateGroupName(e, groupId)}
                    />
                    <InputErrorMessage errors={errors} name="name" />
                  </>
                );
              }}
              rules={{
                validate: (value) => {
                  if (!value) return DefinedErrorMessage.REQUIRED_MESSAGE;
                },
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">Group Type</label>
          <Col>
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const {
                  onChange: onControllerChange,
                  value,
                  ...restOfField
                } = field;
                return (
                  <>
                    <DropdownInput
                      externalValue={value}
                      setExternalValue={onControllerChange}
                      placeholder="Select group type"
                      options={groupTypeOptions}
                      isInvalid={!!error}
                      {...restOfField}
                    />
                    <InputErrorMessage errors={errors} name="type" />
                  </>
                );
              }}
              rules={{
                required: DefinedErrorMessage.REQUIRED_MESSAGE,
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">Company</label>
          <Col>
            <Controller
              name="companyIds"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const {
                  onChange: onControllerChange,
                  value,
                  ...restOfField
                } = field;
                return (
                  <>
                    <MultiSelectionDropDown
                      externalValue={value}
                      setExternalValue={(value) => {
                        onCompaniesChange(value);
                        onControllerChange(value);
                      }}
                      placeholder="Select companies"
                      options={companyOptions}
                      isInvalid={!!error}
                      {...restOfField}
                    />
                    <InputErrorMessage errors={errors} name="companyIds" />
                  </>
                );
              }}
              rules={{
                validate: (value) => {
                  if (!value || value.length === 0)
                    return DefinedErrorMessage.REQUIRED_MESSAGE;
                },
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">Users</label>
          <Col>
            <Controller
              name="userIds"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const {
                  onChange: onControllerChange,
                  value,
                  ...restOfField
                } = field;
                return (
                  <>
                    <MultiSelectionDropDown
                      disabled={!selectedCompanyIds?.length}
                      externalValue={value}
                      setExternalValue={onControllerChange}
                      placeholder="Select users"
                      options={userOptions}
                      isInvalid={!!error}
                      {...restOfField}
                    />
                    <InputErrorMessage errors={errors} name="userIds" />
                  </>
                );
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">
            Group Status
          </label>
          <Col className="d-flex align-items-center">
            <Controller
              name="active"
              control={control}
              render={({ field }) => {
                const { value, ...rest } = field;
                return <FormCheck type="switch" checked={value} {...rest} />;
              }}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="link-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          className="ms-auto"
          disabled={!isValid || isUpdating}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUserGroupModal;
