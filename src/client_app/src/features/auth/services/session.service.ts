import { handleResponse } from "@/helpers/handle-response";
import { User } from "@/models/user";
import env from "@env";

class SessionService {
  private _sessionKey = "_user";

  private setCurrentUser(user: User | any): User | any {
    if (!user) {
      localStorage.removeItem(this._sessionKey);
    } else {
      localStorage.setItem(this._sessionKey, JSON.stringify(user));
    }
    return user;
  }

  getCurrentUser(): User | undefined {
    const user = localStorage.getItem(this._sessionKey);
    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  }

  refreshToken(): Promise<User | undefined> {
    const { token, refreshToken } = this.getCurrentUser() || {};
    if (!token || !refreshToken) return Promise.reject();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refreshToken }),
    };
    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/refresh-token`,
      requestOptions
    )
      .then(handleResponse)
      .then((tokenModel) => {
        return this.updateToken(tokenModel.token, tokenModel.refreshToken);
      });
  }

  updateToken(token: string, refreshToken: string) {
    const oldUser = this.getCurrentUser();
    const newUser = {
      ...oldUser,
      token,
      refreshToken,
    } as User;

    this.setCurrentUser(newUser);

    return newUser;
  }

  getMyInfo(token?: string | null, refreshToken?: string | null): Promise<any> {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (!!token ? token : this.getCurrentUser()?.token),
      },
    };
    return new Promise((resolve, reject) => {
      fetch(`${env.VITE_APP_API_END_POINT}/auth/userinfo`, requestOptions)
        .then(handleResponse)
        .then((user) => {
          this.setCurrentUser({
            ...user,
            token: !!token ? token : this.getCurrentUser()?.token,
            refreshToken: refreshToken,
          });
          resolve(user);
        })
        .catch((e) => {
          console.log(e);
          if (e.status === "409" && e.data.landingPage) {
            window.location.href = e.data.landingPage;
          } else {
            reject(e);
          }
        });
    });
  }

  logOut(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return new Promise<void>((resolve) => {
        resolve();
      });
    }

    const { token, refreshToken } = currentUser;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refreshToken }),
    };

    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/logout`,
      requestOptions
    ).then((response) => {
      this.setCurrentUser(undefined);
      handleResponse(response);
    });
  }

  login(email: string, password: string) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    };

    return fetch(`${env.VITE_APP_API_END_POINT}/auth/login`, requestOptions)
      .then(handleResponse)
      .then((user) => {
        this.setCurrentUser({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          companyId: user.companyId,
          token: user.token,
          actions: user.actions,
          refreshToken: user.refreshToken
        });
      });
  }

  resetPassword(email: string, password: string, token: string): Promise<any> {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, token }),
    };
    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/reset-password`,
      requestOptions
    ).then(handleResponse);
  }

  checkEmailToken(id: string, token: string, type: string): Promise<any> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, token: token, type: type }),
    };
    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/verify-email-token`,
      requestOptions
    ).then(handleResponse);
  }

  sendResetPassword(email: string): Promise<any> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };
    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/reset-password`,
      requestOptions
    ).then(handleResponse);
  }

  createPassword(email: string, password: string, token: string): Promise<any> {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        token,
      }),
    };
    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/create-password`,
      requestOptions
    )
      .then(handleResponse)
      .then((user) => {
        this.setCurrentUser({
          id: user.id,
          email: user.email,
          username: user.userName,
          fullName: user.fullName,
          token: user.token,
          actions: user.actions,
        });
      });
  }

  resendCreatePasswordEmail(email: string): Promise<any> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };
    return fetch(
      `${env.VITE_APP_API_END_POINT}/auth/resend-create-password`,
      requestOptions
    ).then(handleResponse);
  }
}
const sessionService = new SessionService();

export default sessionService;
