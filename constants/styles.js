import styled from 'styled-components';
import { COLORS, FONTS, SIZES } from './theme';

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  background-color: ${COLORS.white};
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${COLORS.primary};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-vertical: 20px;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${COLORS.lightGray};
  padding: 15px;
  border-radius: 10px;
  font-size: ${SIZES.font}px;
  margin-vertical: 10px;
`;

export const ErrorMsg = styled.Text`
  font-size: ${SIZES.smallFont}px;
  color: ${COLORS.red};
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: ${SIZES.mediumFont}px;
  color: ${COLORS.black};
`;
