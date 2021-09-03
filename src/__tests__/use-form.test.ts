import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../hooks';

describe('use-form Test', () => {
  it('Required Test', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          FirstName: '',
        },
        validationRules: {
          FirstName: {
            isRequired: true,
          },
        },
      })
    );

    act(() => result.current.setFieldValue('FirstName', ''));
    act(() => result.current.validateField('FirstName'));

    expect(result.current.errors.FirstName.isInValid).toBe(true);
    expect(result.current.errors.FirstName.isRequired?.message).toBe('FirstName is required.');

    act(() => result.current.setFieldValue('FirstName', 'A'));
    act(() => result.current.validateField('FirstName'));

    expect(result.current.errors.FirstName.isInValid).toBe(false);
    expect(result.current.errors.FirstName.isRequired?.message).toBe(undefined);
  });

  it('MaxLength Test', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          password: '',
        },
        validationRules: {
          password: {
            maxLength: 12,
          },
        },
      })
    );

    act(() => result.current.setFieldValue('password', 'abcdefghijklm'));
    act(() => result.current.validateField('password'));

    expect(result.current.errors.password.isInValid).toBe(true);
    expect(result.current.errors.password.maxLength?.message).toBe('password must be less than or equal to 12 characters.');

    act(() => result.current.setFieldValue('password', 'abc'));
    act(() => result.current.validateField('password'));

    expect(result.current.errors.password.isInValid).toBe(false);
    expect(result.current.errors.password.maxLength?.message).toBe(undefined);
  });

  it('MinLength Test', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          password: '',
        },
        validationRules: {
          password: {
            minLength: 4,
          },
        },
      })
    );

    act(() => result.current.setFieldValue('password', 'abc'));
    act(() => result.current.validateField('password'));

    expect(result.current.errors.password.isInValid).toBe(true);
    expect(result.current.errors.password.minLength?.message).toBe('password must be 4 characters or more.');

    act(() => result.current.setFieldValue('password', 'abcd'));
    act(() => result.current.validateField('password'));

    expect(result.current.errors.password.isInValid).toBe(false);
    expect(result.current.errors.password.minLength?.message).toBe(undefined);
  });

  it('Max Test', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          age: '',
        },
        validationRules: {
          age: {
            max: 50,
          },
        },
      })
    );

    act(() => result.current.setFieldValue('age', '51'));
    act(() => result.current.validateField('age'));

    expect(result.current.errors.age.isInValid).toBe(true);
    expect(result.current.errors.age.max?.message).toBe('age must be less than or equal to 50.');

    act(() => result.current.setFieldValue('age', '50'));
    act(() => result.current.validateField('age'));

    expect(result.current.errors.age.isInValid).toBe(false);
    expect(result.current.errors.age.max?.message).toBe(undefined);
  });

  it('Min Test', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          age: '',
        },
        validationRules: {
          age: {
            min: 10,
          },
        },
      })
    );

    act(() => result.current.setFieldValue('age', '9'));
    act(() => result.current.validateField('age'));

    expect(result.current.errors.age.isInValid).toBe(true);
    expect(result.current.errors.age.min?.message).toBe('age must be greater than or equal to 10.');

    act(() => result.current.setFieldValue('age', '10'));
    act(() => result.current.validateField('age'));

    expect(result.current.errors.age.isInValid).toBe(false);
    expect(result.current.errors.age.min?.message).toBe(undefined);
  });

  it('Custom Test', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          email: '',
        },
        validationRules: {
          email: {
            validate: (value: string) => {
              const regExp = new RegExp('@');
              const result = regExp.exec(value);
              return !result;
            },
          },
        },
      })
    );

    act(() => result.current.setFieldValue('email', 'test'));
    act(() => result.current.validateField('email'));

    expect(result.current.errors.email.isInValid).toBe(true);

    act(() => result.current.setFieldValue('email', 'test@gmail.com'));
    act(() => result.current.validateField('email'));

    expect(result.current.errors.email.isInValid).toBe(false);
  });

  it('All Field Validate', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          firstName: '',
          password: '',
          age: '',
          email: '',
        },
        validationRules: {
          firstName: {
            isRequired: true,
          },
          password: {
            maxLength: 12,
            minLength: 4,
          },
          age: {
            max: 50,
            min: 10,
          },
          email: {
            validate: (value: string) => {
              const regExp = new RegExp('@');
              const result = regExp.exec(value);
              return !result;
            },
          },
        },
      })
    );

    act(() => {
      result.current.setFieldValue('firstName', '');
      result.current.setFieldValue('password', 'abcdefghijklm');
      result.current.setFieldValue('age', '51');
      result.current.setFieldValue('email', 'test');
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.email.isInValid).toBe(true);
    expect(result.current.errors.firstName.isRequired?.message).toBe('firstName is required.');
    expect(result.current.errors.password.maxLength?.message).toBe('password must be less than or equal to 12 characters.');
    expect(result.current.errors.age.max?.message).toBe('age must be less than or equal to 50.');

    act(() => {
      result.current.resetErrors();
    });

    let submitResult: string = '';

    act(() => {
      result.current.onSubmit(() => (submitResult = 'called submit'))({ preventDefault: () => ({}) } as any);
    });

    expect(submitResult).toBe('');

    act(() => {
      result.current.setFieldValue('firstName', 'test');
      result.current.setFieldValue('password', 'abcd');
      result.current.setFieldValue('age', '50');
      result.current.setFieldValue('email', 'test@gmail.com');
    });
    act(() => {
      result.current.validate();
    });
    expect(result.current.errors.firstName.isRequired?.message).toBe(undefined);
    expect(result.current.errors.password.maxLength?.message).toBe(undefined);
    expect(result.current.errors.age.max?.message).toBe(undefined);
    expect(result.current.errors.email.isInValid).toBe(false);

    act(() => {
      result.current.onSubmit(() => {
        submitResult = 'called submit';
      })({ preventDefault: () => ({}) } as any);
    });

    expect(submitResult).toBe('called submit');
  });
});
