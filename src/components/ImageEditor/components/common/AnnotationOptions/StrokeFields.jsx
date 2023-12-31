/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import Label from '@scaleflex/ui/core/label';

/** Internal Dependencies */
import restrictNumber from '../../../utils/restrictNumber';
import ColorInput from '../ColorInput';
import { StyledSpacedOptionFields } from './AnnotationOptions.styled';
import Slider from '../Slider';

const MIN_PERCENTANGE = 0;
const MAX_PERCENTANGE = 15; //--- Reduce from 100 to 10 ---//

const StrokeFields = ({ annotation, updateAnnotation, t }) => {
  const { stroke, strokeWidth } = annotation;

  const changeStrokeWidth = (newStrokeWidth) => {
    updateAnnotation({
      strokeWidth: restrictNumber(
        newStrokeWidth,
        MIN_PERCENTANGE,
        MAX_PERCENTANGE,
      ),
    });
  };

  const changeStrokeColor = (newStrokeColor) => {
    updateAnnotation({ stroke: newStrokeColor });
  };

  return (
    <StyledSpacedOptionFields>
      <Label>{t('stroke')}</Label>
      <Slider
        annotation="px"
        onChange={changeStrokeWidth}
        value={strokeWidth}
        min={MIN_PERCENTANGE}
        max={MAX_PERCENTANGE}
      />
      <ColorInput color={stroke} onChange={changeStrokeColor} />
    </StyledSpacedOptionFields>
  );
};

StrokeFields.propTypes = {
  annotation: PropTypes.instanceOf(Object).isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default StrokeFields;
