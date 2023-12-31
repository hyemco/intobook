import { styled } from 'styled-components';

export const SearchBottomeSheetDiv = styled.div`
  padding: 13px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-family: var(--content-font);
  font-weight: 400;
  font-size: var(--font-size-h4);
  color: #00000066;
  width: 360px;
  min-height: 24px;
  text-align: center;
`;

export const TopLine = styled.div`
  width: 360px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  `;
  
export const Line = styled.div`
  width: 340px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.2);
  margin-top: 14px;
`;