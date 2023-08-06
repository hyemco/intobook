import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BookshelvesContent from './BookshelvesContent'; // 책장 내용 컴포넌트를 import 해주세요

const BookshelvesMain = () => {
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'read', 'reading' 중 하나로 초기화

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="전체" value="all" />
        <Tab label="읽은 책" value="read" />
        <Tab label="읽고 있는 책" value="reading" />
      </Tabs>
      <BookshelvesContent selectedTab={selectedTab} />
    </div>
  );
};

export default BookshelvesMain;