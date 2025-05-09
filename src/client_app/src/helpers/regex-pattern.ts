export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]{1,64}(\.[^<>()\[\]\\.,;:\s@"]{1,64})*)|(".{1,64}"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;

export const atLeastANumber = /\d/;

export const oneLowerCase = /^(?=.*?[a-z])/;
export const oneUpperCase = /^(?=.*?[A-Z])/;
export const oneSpecialCharacter = /[ !@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]/;
export const phoneRegex = /\([0-9]{2}\)[0-9]{3}-[0-9]{2}-[0-9]{3}/;
export const onlyCharacterRegex = /^[a-zA-Z ]+$/;
