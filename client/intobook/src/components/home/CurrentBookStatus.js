import React, { useState, useEffect } from 'react';
import Modal from './../common/Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BookmarkStatusAtom, BluetoothAtom, ReadingBookAtom } from './../../recoil/bookmark/bookmarkAtom';
import { formatTimeDifference } from '../../utils/dateTimeUtils';
import { BasicButton, ProgressBar } from '../common';
import { getReadingBookInfo } from '../../api/userbookApi';
import SearchBottomSheet from '../bookSearch/SearchBottomSheet';
import { styled, keyframes, css } from 'styled-components';
import ConfettiExplosion from 'react-confetti-explosion';
const CurrentBookStatus = () => {
  const [isExploding, setIsExploding] = useState(false);

  const startExplode  = () => {
    setIsExploding(true); // 폭죽 값을 업데이트
    setTimeout(() => setIsExploding(false), 4000);
  };


  const [openModal, setOpenModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const isConnected = useRecoilValue(BluetoothAtom);
  const isBookmarkOut = useRecoilValue(BookmarkStatusAtom);
  const [nowReadingBook, setNowReadingBook] = useRecoilState(ReadingBookAtom);

  const tempTitle = nowReadingBook?.title;
  const title = tempTitle && tempTitle.includes('-') ? tempTitle.split('-')[0].trim() : tempTitle;

  // 지난 로그 기록 기준 1초마다 갱신
  const lastLog = formatTimeDifference(nowReadingBook?.completedAt);
  const [timeDifference, setTimeDifference] = useState(lastLog);
  const nowPage = nowReadingBook?.nowPage;
  const progress = nowReadingBook?.progress;
  const [openCompleteBookModal, setOpenCompleteBookModal] = useState(false);

  

  const searchHandler = () => {
    setIsOpen(true);
  };

  const closeCompleteBookModal = () => {
    setOpenCompleteBookModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const lastLog = formatTimeDifference(nowReadingBook?.completedAt);
      setTimeDifference(lastLog);
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, [nowReadingBook?.completedAt]);

  useEffect(() => {
    const getReadingBook = async () => {
      const detailInfo = await getReadingBookInfo();
      setNowReadingBook(detailInfo);
      // 진행률 95% 이상일 때 모달 띄우기(nowPage가 0이면 확인 불가)
      if (detailInfo?.nowPage && detailInfo?.page) {
        const progress = detailInfo?.progress;
        
        if (progress >= 95) {
          // localStorage 값 설정
          const modalVal = localStorage.getItem('hasCloseCompleteBookModal')
          if (modalVal === null) {
            localStorage.setItem('hasCloseCompleteBookModal', 'false');
          }
          // localStorage 값이 true가 아닐 때만 모달 띄우기
          if (modalVal !== 'true') {
            setOpenCompleteBookModal(true);
          }
        }
      }
    };
    getReadingBook();

  }, [setNowReadingBook]);

  return (
    <> <div style={{position: 'relative'}}>{isExploding && <ConfettiExplosion style={ {position:'absolute', bottom:'15rem'}}/>}</div>
      {nowReadingBook && (
        <>
          <Content style={{color:'var(--main-purple-color'}}>{title}</Content>
          {(isConnected && isBookmarkOut) &&
            <>
              <Content>새로운 히스토리를 만들어가는 중!</Content>
            </>
          }
          {(!isConnected || (isConnected && !isBookmarkOut)) &&
            <>
              {nowReadingBook?.completedAt ? (
                <div>
                  <Content>마지막 히스토리로 부터</Content>
                  <Content style={{ marginBottom: '5px' }}>
                    <Span>{lastLog} </Span>
                    지났습니다.
                  </Content>
                  <StyledProgressBar
                      onClick={() => {
                        if (progress >= 95) setOpenCompleteBookModal(true);
                      }}
                      progress={progress}
                    >
                    {nowReadingBook && <ProgressBar progress={progress} containerWidth={200} bbg={'#D9D9D9'} />}
                  </StyledProgressBar>
                </div>
              ) : (
                <>
                  <Content>첫 히스토리를 쌓으러 가보세요!</Content>
                  {/* <div
                    style={{ cursor: progress >= 95 ? 'pointer' : 'default' }}
                    onClick={() => { if (progress >= 95) setOpenCompleteBookModal(true); }}
                  >
                    {nowReadingBook && <ProgressBar progress={progress} containerWidth={200} bbg={'#D9D9D9'} />}
                  </div> */}
                  <StyledProgressBar
                      onClick={() => {
                        if (progress >= 95) setOpenCompleteBookModal(true);
                      }}
                      progress={progress}
                    >
                    {nowReadingBook && <ProgressBar progress={progress} containerWidth={200} bbg={'#D9D9D9'} />}
                  </StyledProgressBar>
                </>
              )}
              <ImgContainer onClick={() => { setOpenModal(true) }} >
                <BasicButton content={"다른 책 등록하기"} />
              </ImgContainer>
            </>
          }
        </>
      )}
      {!nowReadingBook && (
        <div>
          <Content style={{ color: 'var(--main-point-color)' }}>지금 읽고 있는 책이 없네요!</Content>
          <Content style={{ color: 'var(--main-point-color)' }}>북갈피에 읽을 책을 등록해보세요 :)</Content>
          <ImgContainer onClick={() => { setOpenModal(true) }} >
            <BasicButton content={"책 찾으러 가기"} />
          </ImgContainer>
        </div>
      )}
      <Modal openModal={openModal} setOpenModal={setOpenModal} modalType={'readingBook'} closeModal={closeModal} height={'510px'} />
      <SearchBottomSheet isOpen={isOpen} setIsOpen={setIsOpen} clickHandler={searchHandler} />
      <Modal openModal={openCompleteBookModal} setOpenModal={setOpenCompleteBookModal} modalType={'completeBook'} closeModal={closeCompleteBookModal} startExplode={ startExplode } height={'160px'} />
    </>
  );
};

const Content = styled.div`
  text-align: center;
  letter-spacing: 0.8px;
  font-size: var(--font-h6);
  margin: 5px 0 8px 0;
  `;

const Span = styled.span`
  color: var(--main-color);
  font-size: 15px;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  gap: 6px;
  cursor: pointer;
`;

const styledButtonStyles = (progress) => {
  if (progress >= 95) {
    return {
      cursor: 'pointer',
    };
  }

  // 95 미만일 때의 스타일
  return {
    cursor: 'default',
  };
};


// const styledFullProgressbar = {
//   cursor: 'pointer',
//   border: '1px solid var(--main-red-color)',
//   padding: '1px 1px',
//   borderRadius: '10px',
// }

const styledProgressbar = {
    cursor: 'default'
}

const StyledProgressBar = styled.div`
  cursor: ${({ progress }) => (progress >= 95 ? 'pointer' : 'default')};
  ${({ progress }) =>
    progress >= 95 &&
    css`
      padding: 0px 0px;
      border: 2px solid white;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      animation: ${lightEffectKeyframes} 0.4s infinite;
    `}
`;

const lightEffectKeyframes = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 187, 50);
  }
  50% {
    box-shadow: 0 0 12px rgba(255, 187, 50);
  }
`;

export default CurrentBookStatus;