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
