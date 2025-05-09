import InputErrorMessage from '@/components/InputErrorMessage';
import DefinedErrorMessage from '@/constants/message';
import { useNotification } from '@/providers/NotificationProvider';
import { StyledModalHeader } from '@/styles/common';
import {
  CreateProjectModel,
  ProjectViewModel,
  UpdateProjectModel,
} from '@admin/models/project';
import {
  checkProjectNameExists,
  createProject,
  updateProject,
} from '@admin/services/project.service';
import { useCallback, useState } from 'react';
import { Button, Col, FormControl, Modal, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';

interface Props {
  setShowModal: (show: boolean) => void;
  isEditing: boolean;
  selectedProject?: ProjectViewModel;
  fetchProjects: () => void;
}

function ProjectModal({
  setShowModal,
  isEditing,
  selectedProject,
  fetchProjects,
}: Readonly<Props>) {
  const { showInfo } = useNotification();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<CreateProjectModel | UpdateProjectModel>({
    defaultValues: {
      projectName: (isEditing && selectedProject?.projectName) || '',
      companyName: (isEditing && selectedProject?.company) || '',
    },
    mode: 'all',
  });

  const [projectNameCheck, setProjectNameCheck] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClose = () => {
    setShowModal(false);
  };

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    if (isEditing) {
      handleEditProject(data);
    } else {
      handleCreateProject(data);
    }
  });

  const handleCreateProject = (data: CreateProjectModel) => {
    createProject(data)
      .then(() => {
        onClose();
        showInfo('Project created successfully.', 'success', 5000);
        fetchProjects();
      })
      .catch((error: any) => {
        if (error.status === 409) {
          const { field } = error.data;
          if (field === 'ProjectName') {
            setError('projectName', {
              type: 'manual',
              message: DefinedErrorMessage.NAME_EXISTS_MESSAGE,
            });
          }

          console.error('Failed to create new project: ', error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEditProject = (data: UpdateProjectModel) => {
    updateProject(selectedProject!.id, data)
      .then(() => {
        onClose();
        showInfo('Project edited successfully.', 'success', 5000);
        fetchProjects();
      })
      .catch((error: any) => {
        if (error.status === 409) {
          setError('projectName', {
            type: 'manual',
            message: DefinedErrorMessage.NAME_EXISTS_MESSAGE,
          });
          console.error('Failed to edit project: ', error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validateProjectName = useCallback(
    async (name: string) => {
      const trimmedName = name.trim();
      if (projectNameCheck === trimmedName) {
        return;
      }

      setProjectNameCheck(trimmedName);
      const exists = await checkProjectNameExists(
        trimmedName,
        selectedProject?.id,
      );
      if (exists) {
        setError('projectName', {
          type: 'manual',
          message: DefinedErrorMessage.NAME_EXISTS_MESSAGE,
        });
        return DefinedErrorMessage.NAME_EXISTS_MESSAGE;
      } else {
        clearErrors('projectName');
        return true;
      }
    },
    [setError, clearErrors, projectNameCheck, selectedProject],
  );

  return (
    <Modal
      data-testid="new-project-modal"
      show={true}
      onHide={onClose}
      onExited={() => reset()}
      centered
      className="modal-blur fade"
      backdrop="static"
      size="lg"
    >
      <StyledModalHeader closeButton closeVariant="white">
        <Modal.Title>{isEditing ? 'Edit Project' : 'New Project'}</Modal.Title>
      </StyledModalHeader>
      <Modal.Body>
        <Row className="mb-3">
          <label className="col-3 col-form-label form-label">
            Project Name
          </label>
          <Col>
            <Controller
              name="projectName"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <FormControl
                      type="text"
                      className={errors.projectName ? 'is-invalid' : ''}
                      maxLength={250}
                      autoComplete="off"
                      placeholder="Enter project name here"
                      {...field}
                      onBlur={async (e) => {
                        const trimmedValue = e.target.value.trim();
                        if (trimmedValue) {
                          await validateProjectName(trimmedValue);
                        } else {
                          trigger('projectName');
                        }
                        setValue('projectName', trimmedValue);
                      }}
                    />
                    <InputErrorMessage errors={errors} name="projectName" />
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
            Company Name
          </label>
          <Col>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <FormControl
                      type="text"
                      className={errors.companyName ? 'is-invalid' : ''}
                      disabled={isEditing}
                      maxLength={250}
                      autoComplete="off"
                      placeholder="Enter company name here"
                      {...field}
                    />
                    <InputErrorMessage errors={errors} name="companyName" />
                  </>
                );
              }}
              rules={{
                required: DefinedErrorMessage.REQUIRED_MESSAGE,
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
          disabled={!isValid || isLoading}
        >
          {isEditing ? 'Save' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProjectModal;
