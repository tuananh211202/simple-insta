import { Avatar, Divider, Drawer, Input, List, Skeleton } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";
import { useState } from "react";
import { useMutation } from "react-query";
import { getListUser } from "../../midleware/api/user";
import InfiniteScroll from 'react-infinite-scroll-component';

type UserData = {
  userId: number;
  name: string;
  email: string;
  description: string;
  avatar: string;
};

const StyledDrawner = styled(Drawer)`
  padding: 0px 10px;
  font-family: Poppins;
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    height: 50px;
  }
  .ant-divider {
    padding: 0;
    margin: 0;
  }
  .search-box {
    width: 100%;
    margin: 20px 0px;
  }
  .ant-list-item-meta-avatar {
    height: 100%;
  }
`;

const SearchDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;
  const [searchValue, setSearchValue] = useState<string>();
  const [page, setPage] = useState(1);
  const [listUser, setListUser] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);

  const getListUserMutation = useMutation(getListUser, {
    onSuccess: (data) => {
      setTotal(data.total);
      setListUser([
        ...listUser,
        ...data.users
      ]);
    }
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
    getListUserMutation.mutate({ name: value, page: 1, pageSize: 10 });
  }

  const handleGetMore = () => {
    getListUserMutation.mutate({ name: searchValue ?? '', page: page + 1, pageSize: 10 });
    setPage(page + 1);
  }

  const profileUserLink = (userId: number) => {
    return '/profile/'+userId;
  }

  return (
    <StyledDrawner 
      open={isOpen} 
      onClose={onClose}
      closeIcon={false}
    >
      <div className="header">Search</div>
      <Divider />
      <div className="search-box">
        <Input.Search placeholder="Input name" onSearch={handleSearch} />
        <div
          id="scrollableDiv"
          style={{
            height: 'calc(100vh - 150px)',
            overflow: 'auto',
            padding: '0 16px',
            margin: '20px 0 0 0'
          }}
        >
          <InfiniteScroll
            dataLength={listUser.length}
            next={handleGetMore}
            hasMore={listUser.length < total}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
             <List
              dataSource={listUser}
              renderItem={(item) => (
                <List.Item key={item.email}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} size={48} />}
                    title={<a href={profileUserLink(item.userId)}>{item.name}#{item.userId}</a>}
                    description={item.email}
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </div>
    </StyledDrawner>
  )
}

// TODO: remove current user list before search

export default SearchDrawner;
