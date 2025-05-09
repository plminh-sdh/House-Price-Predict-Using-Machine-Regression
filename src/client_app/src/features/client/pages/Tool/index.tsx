import { Col, Container, Form, Row } from 'react-bootstrap';
import {
  PageTitleWrapper,
  PredictResultWrapper,
  SectionTitleWrapper,
} from './styles';
import { FormProvider, useForm } from 'react-hook-form';
import { PredictLoanModel } from '../../models/loan';
import { useCallback, useState } from 'react';
import { CustomButton } from '@/components/common';
import LabelledInputWrapper from '@/components/Inputs/LabelledInputWrapper';
import {
  DateInputRHF,
  PositiveIntegerInputRHF,
} from '@/components/Inputs/InputsWithRHF';
import DefinedErrorMessage from '@/constants/message';
import { predictLoan } from '../../services/predictor.service';
import { PredictResult } from '../../models/predict-result';

function Tool() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [predictResult, setPredictResult] = useState<PredictResult>();

  const predictLoanModel = useForm<PredictLoanModel>({
    mode: 'all',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
  });

  const onSubmit = useCallback((data: PredictLoanModel) => {
    setIsSubmitting(true);
    predictLoan(data)
      .then((result: PredictResult) => {
        setPredictResult(result);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, []);

  const { handleSubmit } = predictLoanModel;

  return (
    <Container fluid className="p-0 mb-5">
      <PageTitleWrapper className="py-2 px-3 my-3">
        Loan Default Predictor Tool
      </PageTitleWrapper>
      <Row>
        <Col className="col-6">
          <SectionTitleWrapper className="py-2 px-3 my-3">
            Results
          </SectionTitleWrapper>
          <Row className="ms-5 mb-3">
            <PredictResultWrapper>
              <b>Default Probability:</b> {predictResult?.defaultRate}
            </PredictResultWrapper>{' '}
          </Row>
          <Row className="ms-5">
            <PredictResultWrapper>
              <b>Key Factors:</b>
              <ul>
                {predictResult?.topFeatures.map((feature) => (
                  <li key={feature.name}>
                    {feature.name} : {feature.value}
                  </li>
                ))}
              </ul>
            </PredictResultWrapper>{' '}
          </Row>
        </Col>
        <Col className="col-6">
          <SectionTitleWrapper className="py-2 px-3 my-3">
            Loan Details
          </SectionTitleWrapper>
          <FormProvider {...predictLoanModel}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="intRate"
                  label="Interest Rate"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="intRate"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper name="dti" label="DTI" hasAsterisk>
                  <PositiveIntegerInputRHF
                    name="dti"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="revolBal"
                  label="Total Credit Revolving Balance"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="revolBal"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="revolUtil"
                  label="Revolving Line Utilization Rate"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="revolUtil"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="earliestCrLine"
                  label="Earliest Credit Line Open Day"
                  hasAsterisk
                >
                  <DateInputRHF
                    name="earliestCrLine"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="annualInc"
                  label="Annual Income"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="annualInc"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="moSinOldIlAcct"
                  label="Months since oldest bank installment account opened"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="moSinOldIlAcct"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="loanAmnt"
                  label="Loan Amount"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="loanAmnt"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="openAcc"
                  label="Number of open credit lines"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="openAcc"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="ficoScore"
                  label="Fico Scores"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="ficoScore"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="d-flex justify-content-center">
                <CustomButton
                  $maxWidth="20rem"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </CustomButton>
              </Row>
            </Form>
          </FormProvider>{' '}
        </Col>
      </Row>
    </Container>
  );
}

export default Tool;
