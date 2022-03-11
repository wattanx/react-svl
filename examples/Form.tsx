import { Box } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { useForm } from '../src';

export const ValdiationExample = () => {
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
