import InputErrorMessage from '@/components/InputErrorMessage';
import DropdownInput from '@/components/Inputs/DropdownInput';
import MultiSelectionDropDown from '@/components/Inputs/MultiSelectionDropDown';
import { emailRegex, onlyCharacterRegex } from '@/helpers/regex-pattern';
import { StyledModalHeader } from '@/styles/common';
import { checkExistingUser, createUser } from '@admin/services/user.service';
import { IconPlus } from '@tabler/icons-react';
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
import Option from '@/models/option';
import React from 'react';
import { useNotification } from '@/providers/NotificationProvider';
import { getByCompany } from '@admin/services/group.service';
import { IdName } from '@/models/id-name';
import DefinedErrorMessage from '@/constants/message';

type Props = {
  companyOptions: Array<Option>;
  setRefresh: () => void;
};

function NewUserModal({ companyOptions, setRefresh }: Props) {
  const { showInfo, showError } = useNotification();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [userGroupOptions, setUserGroupOptions] = useState<Option[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      companyId: '',
      groupIds: [],
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

  const onModalClose = () => {
    setShowModal(false);
  };

  const onSubmit = handleSubmit((data) => {
    setIsCreating(true);
    checkExistingUser(data.email)
      .then(() => {
        createUser(data)
          .then(() => {
            setRefresh();
            onModalClose();
            showInfo('User created successfully.', 'success', 3000);
          })
          .catch((err) => {
            console.error(err);
            showError(err.status, 'Failed to create user.');
          });
      })
      .catch(() => {
        setError('email', {
          type: 'manual',
          message: 'Email already exists.',
        });
      })
      .finally(() => setIsCreating(false));
  });

  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        <IconPlus size={20} className="me-2" />
        New User
      </Button>

      <Modal
        data-testid="new-user-modal"
        show={showModal}
        onHide={onModalClose}
        onExited={() => reset()}
        centered
        className="modal-blur fade"
        backdrop="static"
        size="lg"
      >
        <StyledModalHeader closeButton closeVariant="white">
          <Modal.Title>New User</Modal.Title>
        </StyledModalHeader>
        <Modal.Body>
          <Row className="mb-3">
            <label className="col-3 col-form-label form-label">Full Name</label>
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
                    message: 'Must not contain a special character or number.',
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
            <label className="col-3 col-form-label form-label">Company</label>
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
                        placeholder="Select company"
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="link-secondary"
            onClick={onModalClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            className="ms-auto"
            disabled={!isValid || isCreating}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default NewUserModal;
