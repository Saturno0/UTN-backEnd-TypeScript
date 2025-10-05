export const isGoodPassword = value => {
    // minimo 8 caracteres, minimo un digito numerico, una letra minuscula y una letra mayuscula
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    return regex.test(value);
}