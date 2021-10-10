# react-svl

![npm](https://img.shields.io/npm/v/react-svl)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-svl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

react-svl is simple validation library for React.

## Install

To use react-svl, all you need to do is install the react-svl package.

```
npm install react-svl
```

or

```
yarn add react-svl
```

## Usage

This is an example of using Chakra UI.

```tsx
import { useForm } from 'react-svl';

export const ValdiationExample = () => {
  // setting initialValues and validationRules
  const { errors, values, setFieldValue, validateField } = useForm({
    initialValues: {
      FirstName: '',
      Password: '',
    },
    validationRules: {
      FirstName: {
        isRequired: true,
      },
      Password: {
        minLength: 8,
      },
    },
  });
  return (
    <Box>
      <FormControl isInvalid={errors.FirstName.isInValid}>
        <FormLabel>First Name</FormLabel>
        <Input
          value={values.FirstName}
          onChange={(e) => setFieldValue('FirstName', e.currentTarget.value)}
          onBlur={() => validateField('FirstName')}
        />
        <FormErrorMessage>{errors.FirstName.isRequired?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.Password.isInValid}>
        <FormLabel>Password</FormLabel>
        <Input
          value={values.Password}
          onChange={(e) => setFieldValue('Password', e.currentTarget.value)}
          onBlur={() => validateField('Password')}
        />
        <FormErrorMessage>{errors.Password.minLength?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
};
```

## API

### useForm

useForm is custom hook for validation.

```ts
const { errors, values, setFieldValue, validateField } = useForm({
  initialValues: {
    FirstName: '',
    Password: '',
  },
  validationRules: {
    FirstName: {
      isRequired: true,
    },
    Password: {
      minLength: 8,
    },
  },
});
```

### Validation Rule

The following items can be set as validation rules.

| property   | type                           | description                               |
| :--------- | :----------------------------- | :---------------------------------------- |
| isRequired | boolean                        | Required or not                           |
| max        | number                         | Maximum value                             |
| min        | number                         | Minimum value                             |
| maxLength  | number                         | Maximum text length                       |
| minLength  | number                         | Minimum text length                       |
| validate   | (value: T[keyof T]) => boolean | Custom rule(true: Error、false: no error) |

### Change State

You can use `setFieldValue` to change the State.

```tsx
<Input value={values.FirstName} onChange={(e) => setFieldValue('FirstName', e.currentTarget.value)} />
```

### Execute Validate

Using `validateField` will execute the validation.

```tsx
<Input
  value={values.FirstName}
  onChange={(e) => setFieldValue('FirstName', e.currentTarget.value)}
  onBlur={() => validateField('FirstName')}
/>
```

### Default Error Message

It also sets the default message for each validation rule, as shown below. (None in the case of custom rule)
You can use `errors.property_name.rules.name.message`.

| Rule       | Error Message                                                                       |
| :--------- | :---------------------------------------------------------------------------------- |
| isRequired | `{property name}` is required.                                                      |
| max        | `{property name}` must be less than or equal to `{Maximum value}`.                  |
| min        | `{property name}` must be greater than or equal to `{Minimum value}`.               |
| maxLength  | `{property name}` must be less than or equal to `{Maximum text length}` characters. |
| minLength  | `{property name}` must be `{Minimum text length}` characters or more.               |
