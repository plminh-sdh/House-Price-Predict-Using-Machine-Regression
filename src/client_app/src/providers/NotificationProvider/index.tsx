import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export const TypeNotification = {
  success: "success",
  warning: "warning",
};

interface NotificationContextType {
  showInfo: (message: string, type: string, delayInMs: number) => void;
  showError: (statusCode: number | undefined, message: string) => void;
  showInfos: (message: string, type: string, delayInMs: number) => void;
  showErrors: (error: string, delayInMs: number) => void;
}

const NotificationContext = React.createContext<NotificationContextType>(null!);
interface NotificationContextTypeProps {
  children: React.ReactNode;
}

export function NotificationProvider(props: NotificationContextTypeProps) {
  const { children } = props;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<{ message: string; type: string }[]>(
    []
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [type, setType] = useState("");
  const [delayInMs, setDelayInMs] = useState<number>(3000);

  const showInfo = (
    _message: string,
    _type: string,
    _delayInMs: number = 3000
  ) => {
    setDelayInMs(_delayInMs);
    if (!!_message) {
      setMessage(_message);
      createTimeout(() => {
        setMessage("");
      });
      setType(_type);
    }
  };

  const showInfos = (
    _message: string,
    _type: string,
    _delayInMs: number = 3000
  ) => {
    setDelayInMs(_delayInMs);

    if (!!_message) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: _message, type: _type },
      ]);

      createTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.message !== _message)
        );
      }, _delayInMs);
    }
  };

  const showError = (statusCode: number | undefined, _error: string) => {
    setDelayInMs(6000);
    if (!!statusCode) {
      if (statusCode === 401) {
        setError("Unauthorized Access. Please try to log in again.");
      } else if (statusCode === 403) {
        setError(
          "Access Denied/Forbidden. You do not have permission to access this resource."
        );
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
    } else {
      if (!!_error) {
        setError(_error);
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
    }
    createTimeout(() => {
      setError("");
    });
  };

  const showErrors = (_error: string, _delayInMs: number = 6000) => {
    if (!!_error) {
      setErrors((prevErrors) => [...prevErrors, _error]);

      createTimeout(() => {
        setErrors((prevErrors) => prevErrors.filter((err) => err !== _error));
      }, _delayInMs);
    }
  };

  const createTimeout = (callback: VoidFunction, delay: number = delayInMs) => {
    const id = setTimeout(() => {
      callback();
      clearTimeout(id);
    }, delay);
  };

  const value = {
    showInfo,
    showError,
    showInfos,
    showErrors,
  };

  const renderIcon = (type: string) => {
    if (type === TypeNotification.success) {
      return <IconCheck className="mx-1" />;
    } else if (type === TypeNotification.warning) {
      return <IconInfoCircle className="mx-1" />;
    }
  };

  return (
    <NotificationContext.Provider value={value}>
      <ToastContainer
        containerPosition="fixed"
        position="top-center"
        style={{ zIndex: 9999 }}
        className="pt-1"
      >
        <Toast
          hidden={!message}
          show={!!message}
          onClose={() => setMessage("")}
          bg={type}
        >
          <Toast.Body
            className={`${
              type === TypeNotification.warning ? "text-black" : "text-white"
            } text-center `}
          >
            <div className="d-flex justify-content-center align-items-center">
              <div className="me-2">{renderIcon(type)}</div>
              <div>
                {message.split("<br />").map((splitMessage, index) =>
                  index === 0 ? (
                    <React.Fragment key={index}>{splitMessage}</React.Fragment>
                  ) : (
                    <React.Fragment key={index}>
                      <br />
                      {splitMessage}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </Toast.Body>
        </Toast>

        <Toast show={!!error} onClose={() => setError("")} bg="danger">
          <Toast.Header closeButton={false} className="justify-content-center">
            <strong>Error</strong>
          </Toast.Header>
          <Toast.Body className="text-center text-white">
            {error.split("<br />").map((splitMessage, index) =>
              index === 0 ? (
                <React.Fragment key={index}>{splitMessage}</React.Fragment>
              ) : (
                <React.Fragment key={index}>
                  <br />
                  {splitMessage}
                </React.Fragment>
              )
            )}
          </Toast.Body>
        </Toast>

        {messages.map((msg, index) => (
          <Toast
            key={index}
            show={true}
            onClose={() =>
              setMessages((prevMessages) =>
                prevMessages.filter((_, idx) => idx !== index)
              )
            }
            bg={msg.type}
          >
            <Toast.Body
              className={`${
                msg.type === TypeNotification.warning
                  ? "text-black"
                  : "text-white"
              } text-start`}
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="me-2">{renderIcon(msg.type)}</div>
                <div>
                  {msg.message.split("<br />").map((splitMessage, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                      {splitMessage}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Toast.Body>
          </Toast>
        ))}

        {errors.map((err, index) => (
          <Toast
            key={index}
            show={true}
            onClose={() =>
              setErrors((prevErrors) =>
                prevErrors.filter((_, idx) => idx !== index)
              )
            }
            bg="danger"
          >
            <Toast.Header
              closeButton={false}
              className="justify-content-center"
            >
              <strong>Error</strong>
            </Toast.Header>
            <Toast.Body className="text-start text-white">
              {err.split("<br />").map((splitMessage, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                  {splitMessage}
                </React.Fragment>
              ))}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return React.useContext(NotificationContext);
}
