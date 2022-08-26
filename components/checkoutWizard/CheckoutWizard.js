import React from 'react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Center, Flex, useBreakpoint } from '@chakra-ui/react';

export default function CheckoutWizard({ activeStep = 0 }) {
  const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order'];
  return (
    <Flex
      align={'center'}
      justify="center"
      // border={'thin solid red'}
      p={5}
    >
      <Steps
        mt="1rem"
        pl={{ base: '20vw', sm: '35vw', md: '0' }}
        alignSelf="center"
        // left={{ base: '25%' }}
        activeStep={activeStep}
        responsive={true}
        orientation={'horizontal'}
        labelOrientation={'vertical'}
      >
        {steps.map((step) => (
          <Step key={step} label={step}>
            {/* {step} */}
          </Step>
        ))}
      </Steps>
    </Flex>
  );
}
