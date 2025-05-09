import InputErrorMessage from '@/components/InputErrorMessage';
import DropdownInput from '@/components/Inputs/DropdownInput';
import MultiSelectionDropDown from '@/components/Inputs/MultiSelectionDropDown';
import DefinedErrorMessage from '@/constants/message';
import { emailRegex, onlyCharacterRegex } from '@/helpers/regex-pattern';
import { IdName } from '@/models/id-name';
import Option from '@/models/option';
import { useNotification } from '@/providers/NotificationProvider';
import { StyledModalHeader } from '@/styles/common';
import { UpdateUserModel } from '@admin/models/user';
import { getByCompany } from '@admin/services/group.service';
import { getUserById, updateUser } from '@admin/services/user.service';
import { IconEdit } from '@tabler/icons-react';
import React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  FormCheck,
  FormControl,
  Modal,
  Row,
} from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';

type Props = {
  userId: string | undefined;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  companyOptions: { value: string | number; displayValue: string }[];
  setRefresh: () => void;
};

function EditUserModal({
  userId,
  showModal,
  setShowModal,
  companyOptions,
  setRefresh,
}: Props) {
  const { showError, showInfo } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userGroupOptions, setUserGroupOptions] = useState<Option[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      id: '',
      fullName: '',
      email: '',
      companyId: '',
      groupIds: [],
      active: true,
    },
    mode: 'all',
  });

  const selectedCompanyId = useWatch({ control, name: 'companyId' });
  useEffect(() => {
    if (!selectedCompanyId) {
      setUserGroupOptions([]);
      return;
    }

    getByCompany(Number(selectedCompanyId))
      .then((data) => {
        const options = data.map((group: IdName) => {
          return {
            value: group.id,
            displayValue: group.name,
          };
        });
        setUserGroupOptions(options);
      })
      .catch((err) => console.log(err));
  }, [selectedCompanyId]);

  const onClose = () => {
    setShowModal(false);
  };

  const onSubmit = handleSubmit((data) => {
    setIsUpdating(true);
    const { id, ...rest } = data;
    updateUser(id, rest as UpdateUserModel)
      .then(() => {
        setRefresh();
        onClose();
        showInfo('User edited successfully.', 'success', 3000);
      })
      .catch((error) => {
        console.error('Failed to edit user: ', error);
        showError(error.status, 'Failed to edit user.');
      })
      .finally(() => setIsUpdating(false));
  });

  useEffect(() => {
    if (!showModal || !userId) return;

    setIsLoading(true);
    getUserById(userId)
      .then((data) => {
        reset({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          companyId: data.companyId,
          active: data.active,
          groupIds: data.groupIds,
        });
      })
      .catch((error) => {
        console.error('Failed to get user: ', error);
        showError(error.status, 'Failed to get user.');
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, showModal, userId]);

  return (
    <React.Fragment>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        disabled={!userId}
      >
        <IconEdit size={20} className="me-2" />
        Edit User
      </Button>

      <Modal
        data-testid="edit-user-modal"
        show={showModal}
        onHide={onClose}
        onExited={() => reset()}
        centered
        backdrop="static"
        className="modal-blur fade"
        size="lg"
      >
        <StyledModalHeader closeButton closeVariant="white">
          <Modal.Title>Edit User</Modal.Title>
        </StyledModalHeader>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <Row className="mb-3">
                <label className="col-3 col-form-label form-label">
                  Full Name
                </label>
                <Col>
                  <Controller
                    name="fullName"
                    defaultValue=""
                    control={control}
                    render={({ field }) => {
                      return (
                        <>
                          <FormControl
                            type="text"
                            className={errors.fullName ? 'is-invalid' : ''}
                            autoComplete="off"
                            maxLength={250}
                            placeholder="Enter full name here"
                            {...field}
                          />
                          <InputErrorMessage errors={errors} name="fullName" />
                        </>
                      );
                    }}
                    rules={{
                      required: DefinedErrorMessage.REQUIRED_MESSAGE,
                      pattern: {
                        value: onlyCharacterRegex,
                        message:
                          'Must not contain a special character or number.',
                      },
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <label className="col-3 col-form-label form-label">
                  Email Address
                </label>
                <Col>
                  <Controller
                    name="email"
                    disabled
                    defaultValue=""
                    control={control}
                    render={({ field }) => {
                      return (
                        <>
                          <FormControl
                            type="text"
                            className={errors.email ? 'is-invalid' : ''}
                            autoComplete="off"
                            maxLength={250}
                            placeholder="Enter email here"
                            {...field}
                          />
                          <InputErrorMessage errors={errors} name="email" />
                        </>
                      );
                    }}
                    rules={{
                      required: DefinedErrorMessage.REQUIRED_MESSAGE,
                      pattern: {
                        value: emailRegex,
                        message:
                          'Invalid email address. Please check and re-enter.',
                      },
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <label className="col-3 col-form-label form-label">
                  Company
                </label>
                <Col>
                  <Controller
                    name="companyId"
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
                            setExternalValue={(v) => {
                              onControllerChange(v);
                              setValue('groupIds', []);
                            }}
                            placeholder="Select users"
                            options={companyOptions}
                            isInvalid={!!error}
                            {...restOfField}
                          />
                          <InputErrorMessage errors={errors} name="companyId" />
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
                <label className="col-3 col-form-label form-label">
                  User Group
                </label>
                <Col>
                  <Controller
                    name="groupIds"
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
                            disabled={!selectedCompanyId}
                            externalValue={value}
                            setExternalValue={onControllerChange}
                            placeholder="Select user group"
                            options={userGroupOptions}
                            isInvalid={!!error}
                            {...restOfField}
                          />
                          <InputErrorMessage errors={errors} name="groupIds" />
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
              <Row>
                <label className="col-3 col-form-label form-label">
                  Account Status
                </label>
                <Col className="d-flex align-items-center">
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => {
                      const { value, ...rest } = field;
                      return (
                        <FormCheck type="switch" checked={value} {...rest} />
                      );
                    }}
                  />
                </Col>
              </Row>
            </>
          )}
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
    </React.Fragment>
  );
}

export default EditUserModal;
