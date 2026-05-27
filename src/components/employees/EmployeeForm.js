import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { User, Phone, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { getEmployeeSchema } from "../../utils/validations";
import { employeeService } from "../../services/api";
import { FormField, SelectField, VerifyButton } from "../ui";
import { OtpModal } from "../auth/OtpModal";

const getIdTypes = (t) => [
    { value: "CC",  label: "CC – " + t("employees.idLabels.CC") },
    { value: "CE",  label: "CE – " + t("employees.idLabels.CE") },
    { value: "TI",  label: "TI – " + t("employees.idLabels.TI") },
    { value: "PP",  label: "PP – " + t("employees.idLabels.PP") },
    { value: "NIT", label: "NIT – " + t("employees.idLabels.NIT") },
];

function SectionHeader({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-3 pt-2">
            <div className="w-7 h-7 rounded bg-[#7c6fcd]/10 border border-[#7c6fcd]/20
                      flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[#7c6fcd]" />
            </div>
            <h3 className="font-mono font-semibold text-xs uppercase tracking-widest text-[#4a4560]">
                {title}
            </h3>
            <div className="flex-1 h-px bg-[#d6cfc4]" />
        </div>
    );
}

export function EmployeeForm({ initialData = null, onSuccess, onCancel }) {
    const { t } = useTranslation();
    const isEdit = !!initialData;
    const [loading,  setLoading]  = useState(false);
    const [otpModal, setOtpModal] = useState(null);

    const {
        register, handleSubmit, control, watch, setValue, trigger,
        formState: { errors, dirtyFields },
    } = useForm({
        resolver: yupResolver(getEmployeeSchema(t)),
        defaultValues: {
            fullName:      initialData?.fullName      || "",
            idType:        initialData?.idType        || "",
            idNumber:      initialData?.idNumber      || "",
            phone:         initialData?.phone         || "",
            phoneVerified: initialData?.phoneVerified || false,
            email:         initialData?.email         || "",
            emailVerified: initialData?.emailVerified || false,
            address:       initialData?.address       || "",
        },
    });

    const phoneVal      = watch("phone");
    const emailVal      = watch("email");
    const phoneVerified = watch("phoneVerified");
    const emailVerified = watch("emailVerified");
    const idType        = watch("idType");

    useEffect(() => {
        if (dirtyFields.phone && phoneVerified) {
            setValue("phoneVerified", false);
            toast(t("form.phoneChanged"), { icon: "⚠️" });
        }
    }, [phoneVal]); // eslint-disable-line

    useEffect(() => {
        if (dirtyFields.email && emailVerified) {
            setValue("emailVerified", false);
            toast(t("form.emailChanged"), { icon: "⚠️" });
        }
    }, [emailVal]); // eslint-disable-line

    const handleOpenOtp = async (type) => {
        const valid = await trigger(type === "phone" ? "phone" : "email");
        if (!valid) return;
        setOtpModal(type);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let result;
            if (isEdit) {
                result = await employeeService.update(initialData.id, data);
                toast.success(t("form.updated"));
            } else {
                result = await employeeService.create(data);
                toast.success(t("form.created"));
            }
            onSuccess(result.data);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <SectionHeader icon={User} title={t("form.sectionPersonal")} />

                <FormField
                    label={t("form.fullName")}
                    type="text"
                    placeholder={t("form.fullNamePlaceholder")}
                    error={errors.fullName?.message}
                    {...register("fullName")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Controller
                        name="idType"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                label={t("form.idType")}
                                options={getIdTypes(t)}
                                placeholder={t("form.idTypePlaceholder")}
                                error={errors.idType?.message}
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        label={t("form.idNumber")}
                        type="text"
                        placeholder={idType === "NIT" ? t("form.idNumberPlaceholderNIT") : t("form.idNumberPlaceholder")}
                        error={errors.idNumber?.message}
                        hint={idType === "NIT" ? t("form.idNumberHintNIT") : undefined}
                        {...register("idNumber")}
                    />
                </div>

                <FormField
                    label={t("form.address")}
                    type="text"
                    placeholder={t("form.addressPlaceholder")}
                    error={errors.address?.message}
                    {...register("address")}
                />

                <SectionHeader icon={Phone} title={t("form.sectionContact")} />

                {/* Teléfono */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="label">{t("form.phone")}</label>
                        <VerifyButton
                            verified={phoneVerified}
                            onClick={() => handleOpenOtp("phone")}
                            label={t("form.sendSms")}
                            verifiedLabel={t("form.verified")}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="tel"
                            placeholder={t("form.phonePlaceholder")}
                            className={`field pr-8 ${errors.phone ? "field-error" : ""} ${phoneVerified ? "!border-[#34d399]" : ""}`}
                            {...register("phone")}
                        />
                        {phoneVerified && (
                            <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#34d399]" />
                        )}
                    </div>
                    {errors.phone && <p className="err-msg"><AlertCircle size={12} />{errors.phone.message}</p>}
                    {errors.phoneVerified && !errors.phone && <p className="err-msg"><AlertCircle size={12} />{errors.phoneVerified.message}</p>}
                </div>

                {/* Correo */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="label">{t("form.email")}</label>
                        <VerifyButton
                            verified={emailVerified}
                            onClick={() => handleOpenOtp("email")}
                            label={t("form.sendEmail")}
                            verifiedLabel={t("form.verified")}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder={t("form.emailPlaceholder")}
                            className={`field pr-8 ${errors.email ? "field-error" : ""} ${emailVerified ? "!border-[#34d399]" : ""}`}
                            {...register("email")}
                        />
                        {emailVerified && (
                            <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#34d399]" />
                        )}
                    </div>
                    {errors.email && <p className="err-msg"><AlertCircle size={12} />{errors.email.message}</p>}
                    {errors.emailVerified && !errors.email && <p className="err-msg"><AlertCircle size={12} />{errors.emailVerified.message}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onCancel} className="btn-ghost flex-1">
                        {t("common.cancel")}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                        {loading
                            ? t("form.submitting")
                            : isEdit
                                ? t("form.submitEdit")
                                : t("form.submit")}
                    </button>
                </div>
            </form>

            <OtpModal
                type="phone"
                value={phoneVal}
                open={otpModal === "phone"}
                onClose={() => setOtpModal(null)}
                onSuccess={() => setValue("phoneVerified", true, { shouldValidate: true })}
            />
            <OtpModal
                type="email"
                value={emailVal}
                open={otpModal === "email"}
                onClose={() => setOtpModal(null)}
                onSuccess={() => setValue("emailVerified", true, { shouldValidate: true })}
            />
        </>
    );
}