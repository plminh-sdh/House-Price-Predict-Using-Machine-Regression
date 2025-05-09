import InputErrorMessage from '@/components/InputErrorMessage';
import MultiSelectionDropDown from '@/components/Inputs/MultiSelectionDropDown';
import { StyledModalHeader } from '@/styles/common';
import { useCallback,  useState } from 'react';
import { Button, Col, FormControl, Modal, Row } from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Option from '@/models/option';
import {
  checkGroupNameExits,
  createGroup,
} from '@admin/services/group.service';
import DropdownInput from '@/components/Inputs/DropdownInput';
import { groupTypeOptions } from '@admin/enums/group-type';
import { GroupType } from '@/enums/group-type';
import DefinedErrorMessage from '@/constants/message';
import { useNotification } from '@/providers/NotificationProvider';
import { getUsersByCompanyIds } from '@admin/services/user.service';

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  companyOptions: Option[];
  fetchGroups: () => void;
  resetSelectedGroupId: () => void;
};

function NewUserGroupModal({
  showModal,
  setShowModal,
  companyOptions,
  fetchGroups,
  resetSelectedGroupId,
}: Props) {
  const notification = useNotification();
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      type: GroupType.Workflow,
      companyIds: [],
      userIds: [],
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
    setIsCreating(true);
    createGroup(data)
      .then(() => {
        onClose();
        fetchGroups();
        notification.showInfo(
          'User Group created successfully.',
          'success',
          3000,
        );
      })
      .catch((error) => {
        console.log(error);
        notification.showError(error.status, 'Failed to create group.');
      })
      .finally(() => {
        resetSelectedGroupId();
        setIsCreating(false);
      });
  });

  const validateGroupName = useCallback((e: any) => {
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
    checkGroupNameExits(name).then((data) => {
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
      data-testid="new-group-modal"
      show={showModal}
      onHide={onClose}
      onExited={() => reset()}
      centered
      className="modal-blur fade"
      size="lg"
    >
      <StyledModalHeader closeButton closeVariant="white">
        <Modal.Title>New User Group</Modal.Title>
      </StyledModalHeader>
      <Modal.Body>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">Group Name</label>
          <Col>
            <Controller
              name="name"
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
                      onBlur={(e) => validateGroupName(e)}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="link-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          className="ms-auto"
          disabled={!isValid || isCreating}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewUserGroupModal;
