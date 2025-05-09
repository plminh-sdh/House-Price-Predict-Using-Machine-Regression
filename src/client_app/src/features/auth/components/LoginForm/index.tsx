import { Spinner, InputGroup } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import InputErrorMessage from '@/components/InputErrorMessage';
import { emailRegex } from '@/helpers/regex-pattern';
import { useNavigate } from 'react-router';

import sessionService from '@auth/services/session.service';
import { IconEyeOff, IconEye } from '@tabler/icons-react';
import ErrorModal from '@/components/ErrorModal';

function LoginForm() {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const { control, formState, handleSubmit, clearErrors, setError } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });
  const { errors, dirtyFields } = formState;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInactiveAccount, setIsInactiveAccount] = useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    sessionService
      .login(data.email, data.password)
      .then((_) => navigate('/'))
      .catch((err) => {
        setIsInactiveAccount(err.status === 409);
        if (err.status === 400) {
          setError('password', {
            message: `This email is not registered or the password is incorrect.`,
          });
          setError('email', { message: '' });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  });
  const isDisableSubmitBtn = () =>
    !!errors.email || !!errors.password || isLoading || !dirtyFields.password;

  const resetPasswordValidation = () => {
    if ((formState.errors?.password?.type !== 'required') as boolean) {
      clearErrors('email');
      clearErrors('password');
    }
  };
  const showPasswordHandler = () => setIsPasswordShown(!isPasswordShown);

  return (
    <>
      <form onSubmit={onSubmit} method="get" autoComplete="off" noValidate>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <Controller
            name="email"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { onBlur, onChange, ...rest } = field;
              return (
                <>
                  <input
                    tabIndex={1}
                    type="email"
                    className={
                      'form-control ' + (!!errors.email ? 'is-invalid' : '')
                    }
                    autoComplete="off"
                    placeholder="Enter email address here"
                    onBlur={() => {
                      onBlur();
                      resetPasswordValidation();
                    }}
                    onChange={(e: any) => {
                      resetPasswordValidation();
                      onChange(e);
                    }}
                    {...rest}
                  />

                  <InputErrorMessage errors={errors} name="email" />
                </>
              );
            }}
            rules={{
              required: 'Required.',
              pattern: {
                value: emailRegex,
                message: 'Invalid email address. Please check and re-enter.',
              },
            }}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">
            Password
            <span className="form-label-description"></span>
          </label>
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field }) => {
              const { onChange, ...rest } = field;
              return (
                <>
                  <InputGroup
                    className={
                      'input-group-flat ' +
                      (!!errors.password ? 'is-invalid' : '')
                    }
                  >
                    <input
                      tabIndex={2}
                      className={
                        'form-control ' +
                        (!!errors.password ? 'is-invalid' : '')
                      }
                      placeholder="Password"
                      autoComplete="off"
                      type={isPasswordShown ? 'text' : 'password'}
                      onChange={(e: any) => {
                        resetPasswordValidation();
                        onChange(e);
                      }}
                      {...rest}
                    />
                    <span className="input-group-text">
                      {!isPasswordShown ? (
                        <IconEyeOff
                          height={24}
                          className="icon"
                          onClick={showPasswordHandler}
                          role="button"
                        />
                      ) : (
                        <IconEye
                          height={24}
                          className="icon"
                          onClick={showPasswordHandler}
                          role="button"
                        />
                      )}
                    </span>
                  </InputGroup>
                  <InputErrorMessage errors={errors} name="password" />
                </>
              );
            }}
            rules={{
              required: 'Required.',
            }}
          />
        </div>

        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isDisableSubmitBtn()}
          >
            <Spinner
              animation="border"
              size="sm"
              className="me-2"
              hidden={!isLoading}
            />
            Sign in
          </button>
        </div>
      </form>

      <ErrorModal
        title="Login failed"
        content="Your account has been disabled. Please contact admin for assistance."
        action={'OK'}
        showModal={isInactiveAccount}
        handleCloseModal={() => setIsInactiveAccount(false)}
      />
    </>
  );
}

export default LoginForm;
