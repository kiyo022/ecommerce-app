//郵便番号(XXX-XXXX形式)
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{3}-\d{4}$/;

  return postalCodeRegex.test(postalCode);
};

//電話番号認証(XXX-XXXX-XXXX形式)
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^(0\d{1,4}-?\d{1,4}-?\d{4}|0\d{9,10})$/;
  return regex.test(
    phoneNumber
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3"),
  );
};

//メールアドレス認証
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^/s@]+@[^/s@]+.[^/s@]+$/;
  return regex.test(email);
};

//パスワード認証
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

//パスワード一致確認
export const passwordsMatch = (
  password: string,
  confirmePassword: string,
): boolean => {
  return password === confirmePassword && password.length > 0;
};

//配送先情報全体の検証
export const isValidShippingInfo = (info: {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}): boolean => {
  return (
    info.address.trim().length > 0 &&
    info.city.trim().length > 0 &&
    isValidPostalCode(info.postalCode) &&
    isValidPhoneNumber(info.phone)
  );
};

//エラーメッセージを返却する関数
export const getValidationError = (
  field: string,
  value: string,
  validator: (val: string) => boolean,
): string | null => {
  if (value.trim() === "") {
    return `${field}を入力してください`;
  }

  if (!validator(value)) {
    switch (field) {
      case "郵便番号":
        return "郵便番号は「123-4567」の形式で入力してください";
      case "電話番号":
        return "電話番号は「xxx-xxxx-xxxx」の形式で入力してください";
      case "メールアドレス":
        return "正しいメールアドレスを入力してください";
      case "パスワード":
        return "パスワードは6文字以上である必要があります";
      default:
        return `${field}の形式が正しくありません`;
    }
  }

  return null;
};
