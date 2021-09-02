# SVL

SVL is simple validation library for React.

## Install

To use svl, all you need to do is install the svl package and its peer dependencies.

```
npm install svl react react-dom
```

## Usage

This is an example of using Chakra UI.

```tsx
import { useForm } from 'svl';

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
