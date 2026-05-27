import * as Yup from "yup";

const PHONE_COL = /^(\+57)?[3][0-9]{9}$/;
const PHONE_INT = /^\+?[1-9]\d{6,14}$/;

export const getLoginSchema = (t) =>
    Yup.object({
        username: Yup.string()
            .required(t("validation.usernameRequired"))
            .min(3, t("validation.usernameMin")),
        password: Yup.string()
            .required(t("validation.passwordRequired"))
            .min(6, t("validation.passwordMin")),
    });

export const getEmployeeSchema = (t) =>
    Yup.object({
        fullName: Yup.string()
            .required(t("validation.fullNameRequired"))
            .min(5, t("validation.fullNameMin"))
            .max(100, t("validation.fullNameMax"))
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, t("validation.fullNameLetters")),

        idType: Yup.string()
            .required(t("validation.idTypeRequired"))
            .oneOf(["CC", "CE", "TI", "PP", "NIT"], t("validation.idTypeInvalid")),

        idNumber: Yup.string()
            .required(t("validation.idNumberRequired"))
            .when("idType", {
                is: "NIT",
                then: (s) => s.matches(/^\d{9}-\d{1}$/, t("validation.idNumberNIT")),
                otherwise: (s) => s.matches(/^\d{5,15}$/, t("validation.idNumberDigits")),
            }),

        phone: Yup.string()
            .required(t("validation.phoneRequired"))
            .test("phone-format", t("validation.phoneInvalid"), (v) =>
                PHONE_COL.test(v) || PHONE_INT.test(v)
            ),
        phoneVerified: Yup.boolean()
            .oneOf([true], t("validation.phoneVerifyRequired")),

        email: Yup.string()
            .required(t("validation.emailRequired"))
            .email(t("validation.emailInvalid")),
        emailVerified: Yup.boolean()
            .oneOf([true], t("validation.emailVerifyRequired")),

        address: Yup.string()
            .required(t("validation.addressRequired"))
            .min(8, t("validation.addressMin"))
            .max(200, t("validation.addressMax")),
    });