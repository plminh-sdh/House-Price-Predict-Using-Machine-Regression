import { Col, Container, Form, Row } from 'react-bootstrap';
import {
  PageTitleWrapper,
  PredictResultWrapper,
  SectionTitleWrapper,
} from './styles';
import { FormProvider, useForm } from 'react-hook-form';
import { PredictLoanModel } from '../../models/house-price';
import { useCallback, useState } from 'react';
import { CustomButton } from '@/components/common';
import LabelledInputWrapper from '@/components/Inputs/LabelledInputWrapper';
import {
  DropDownInputRHF,
  PositiveIntegerInputRHF,
  RadioBooleanInputRHF,
} from '@/components/Inputs/InputsWithRHF';
import DefinedErrorMessage from '@/constants/message';
import { predictLoan } from '../../services/predictor.service';
import { PredictResult } from '../../models/predict-result';
import { FirePlaceOptions } from '../../enums/fire-place-options';
import { OverallQualityOptions } from '../../enums/overall-quality-options';
import { GarageFinishOptions } from '../../enums/garage-finish-options';
import { ExteriorQualityOptions } from '../../enums/exterior-quality-options';

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
        House Price Predictor Tool
      </PageTitleWrapper>
      <Row>
        <Col className="col-6">
          <SectionTitleWrapper className="py-2 px-3 my-3">
            Results
          </SectionTitleWrapper>
          <Row className="ms-5 mb-3">
            <PredictResultWrapper>
              <b>Predicted House Price:</b> $
              {predictResult?.housePrice.toFixed(2)}
            </PredictResultWrapper>{' '}
          </Row>
        </Col>
        <Col className="col-6">
          <SectionTitleWrapper className="py-2 px-3 my-3">
            House Details
          </SectionTitleWrapper>
          <FormProvider {...predictLoanModel}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="grLivArea"
                  label="Above grade (ground) living area square feet"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="grLivArea"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="overallQual"
                  label="Overall quality of the house"
                  hasAsterisk
                >
                  <DropDownInputRHF
                    name="overallQual"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                    options={OverallQualityOptions}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="totalBsmtSF"
                  label="Total square feet of basement area"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="totalBsmtSF"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="garageCars"
                  label="Size of garage in car capacity"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="garageCars"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="yearBuilt"
                  label="Original construction date"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="yearBuilt"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="fireplaceQu"
                  label="Fireplace quality"
                  hasAsterisk
                >
                  <DropDownInputRHF
                    name="fireplaceQu"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                    options={FirePlaceOptions}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="yearRemodAdd"
                  label="Remodel year (same as construction year if no remodeling or additions)"
                  hasAsterisk
                >
                  <PositiveIntegerInputRHF
                    name="yearRemodAdd"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="garageFinish"
                  label="Interior finish of the garage"
                  hasAsterisk
                >
                  <DropDownInputRHF
                    name="garageFinish"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                    options={GarageFinishOptions}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="exterQual"
                  label="Exterior quality"
                  hasAsterisk
                >
                  <DropDownInputRHF
                    name="exterQual"
                    rules={{ required: DefinedErrorMessage.REQUIRED_MESSAGE }}
                    options={ExteriorQualityOptions}
                  />
                </LabelledInputWrapper>
              </Row>
              <Row className="mb-3">
                <LabelledInputWrapper
                  name="centralAir"
                  label="Has central air conditioning"
                  hasAsterisk
                >
                  <RadioBooleanInputRHF
                    name="centralAir"
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
