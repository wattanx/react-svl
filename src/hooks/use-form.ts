import { useState } from 'react';

export type ValidationRule<T> = {
  readonly [P in keyof T]: BaseRule<T>;
};

export type BaseRule<T> = {
  isRequired?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  validate?: (value: T[keyof T]) => boolean;
};

export type ErrorType = {
  message?: string;
};

export type ValidationErrorsType = {
  isRequired?: ErrorType;
  min?: ErrorType;
  max?: ErrorType;
  maxLength?: ErrorType;
  minLength?: ErrorType;
  isInValid?: boolean;
};

export type UseFormProps<T> = {
  validationRules: ValidationRule<T>;
  initialValues: T;
};

export function useForm<T extends { [key: string]: any }>({ initialValues, validationRules }: UseFormProps<T>) {
  type ValidationErrors = Record<keyof T, ValidationErrorsType>;

  const initialErrors = Object.keys(initialValues).reduce((acc, field) => {
    acc[field as keyof T] = {
      isRequired: { message: '' },
      min: { message: '' },
      max: { message: '' },
      minLength: { message: '' },
      maxLength: { message: '' },
      isInValid: false,
    };
    return acc;
  }, {} as ValidationErrors);

  const [errors, setErrors] = useState(initialErrors);
  const [values, setValues] = useState(initialValues);

  const resetErrors = () => setErrors(initialErrors);

  const reset = () => {
    setValues(initialValues);
    resetErrors();
  };

  const validate = () => {
    const validationErrors = Object.keys(values).reduce((acc, field) => {
      return validateFields(validationRules, values, acc, field);
    }, {} as ValidationErrors);

    const isInValid = Object.keys(validationErrors).filter((x) => validationErrors[x].isInValid).length > 0;

    setErrors(validationErrors);
    return isInValid;
  };

  const validateField = (field: keyof T) =>
    setErrors((currentErrors) => {
      const validationError = validateFields(validationRules, values, currentErrors, field as string);
      return {
        ...currentErrors,
        [field]: validationError[field],
      };
    });

  const setFieldError = (field: keyof T, error: ValidationErrorsType) =>
    setErrors((currentErrors) => ({ ...currentErrors, [field]: error }));

  const setFieldValue = <K extends keyof T, U extends T[K]>(field: K, value: U) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFieldError(field, {});
  };

  const onSubmit = (handleSubmit: (values: T) => any) => (event?: React.FormEvent) => {
    event && event.preventDefault();
    validate() && handleSubmit(values);
  };

  return {
    values,
    errors,
    validate,
    reset,
    setErrors,
    setValues,
    setFieldValue,
    setFieldError,
    validateField,
    resetErrors,
    onSubmit,
  };
}

const validateFields = <T extends { [key: string]: any }>(
  validationRules: ValidationRule<T>,
  values: T,
  errors: Record<keyof T, ValidationErrorsType>,
  field: string
) => {
  if (!validationRules) {
    return errors;
  }

  errors[field as keyof T] = {
    isInValid: false,
  };

  if (validateRequired(validationRules, values, field)) {
    errors[field as keyof T] = {
      isRequired: { message: `${field} is required.` },
      isInValid: true,
    };
  }
  if (validateMax(validationRules, values, field)) {
    errors[field as keyof T] = {
      ...errors,
      max: { message: `${field} must be less than or equal to ${validationRules[field].max}.` },
      isInValid: true,
    };
  }
  if (validateMin(validationRules, values, field)) {
    errors[field as keyof T] = {
      ...errors,
      min: { message: `${field} must be greater than or equal to ${validationRules[field].min}.` },
      isInValid: true,
    };
  }

  if (validateMaxLength(validationRules, values, field)) {
    errors[field as keyof T] = {
      ...errors,
      maxLength: { message: `${field} must be less than or equal to ${validationRules[field].maxLength} characters.` },
      isInValid: true,
    };
  }

  if (validateMinLength(validationRules, values, field)) {
    errors[field as keyof T] = {
      ...errors,
      minLength: { message: `${field} must be ${validationRules[field].minLength} characters or more.` },
      isInValid: true,
    };
  }

  if (validateCustomFunc(validationRules, values, field)) {
    errors[field as keyof T] = {
      ...errors,
      isInValid: true,
    };
  }

  return errors;
};

const validateRequired = <T extends { [key: string]: any }>(validationRules: ValidationRule<T>, values: T, field: string) => {
  return validationRules[field].isRequired && typeof values[field] === 'string' && (values[field] as string).length <= 0;
};

const validateMax = <T extends { [key: string]: any }>(validationRules: ValidationRule<T>, values: T, field: string) => {
  return validationRules[field].max && values[field] > (validationRules[field].max as number);
};

const validateMin = <T extends { [key: string]: any }>(validationRules: ValidationRule<T>, values: T, field: string) => {
  return validationRules[field].min && values[field] < (validationRules[field].min as number);
};

const validateMaxLength = <T extends { [key: string]: any }>(validationRules: ValidationRule<T>, values: T, field: string) => {
  return (
    validationRules[field].maxLength &&
    typeof values[field] === 'string' &&
    (values[field] as string).length > (validationRules[field].maxLength as number)
  );
};

const validateMinLength = <T extends { [key: string]: any }>(validationRules: ValidationRule<T>, values: T, field: string) => {
  return (
    validationRules[field].minLength &&
    typeof values[field] === 'string' &&
    (values[field] as string).length < (validationRules[field].minLength as number)
  );
};

const validateCustomFunc = <T extends { [key: string]: any }>(validationRules: ValidationRule<T>, values: T, field: string) => {
  return validationRules[field].validate && (validationRules[field].validate as (value: T[keyof T]) => boolean)(values[field]);
};
