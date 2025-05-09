import LoginForm from '@auth/components/LoginForm';
import { LoginCard, Wrapper } from './styles';

function Login() {
  return (
    <div className="container  min-vh-100 position-relative">
      <Wrapper className="container-tight">
        <LoginCard className="card card-md w-100">
          <div className="card-body">
            <h2 className="h2 text-center mb-4">Login to your account</h2>
            <LoginForm />
          </div>
        </LoginCard>
      </Wrapper>
    </div>
  );
}

export default Login;
