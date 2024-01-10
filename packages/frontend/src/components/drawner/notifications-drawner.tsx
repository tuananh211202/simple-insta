import { Divider, Drawer, List, Skeleton } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotiApi } from "../../midleware/api";

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
  .ant-list-item-meta-description {
    text-align: end;
  }
  h4 {
    font-weight: normal;
    a {
      color: #2977ff !important;
    }
  }
`;

type NotiData = {
  notiId: number;
  create_at: string;
  content: string;
  user: {
    userId: number;
  }
}

const NotificationsDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;
  const [page, setPage] = useState(1);
  const [listNoti, setListNoti] = useState<NotiData[]>([]);
  const [total, setTotal] = useState(0);

  const getListNotiMutation = useMutation(NotiApi.getAllNoti, {
    onSuccess: (data, variables) => {
      setTotal(data.total);
      if(variables.page === 1) setListNoti([...data.notis]);
      else {
        setListNoti([
          ...listNoti,
          ...data.notis
        ]);
      }
    }
  });

  const handleGetMore = () => {
    getListNotiMutation.mutate({ page: page + 1, pageSize: 10 });
    setPage(page + 1);
  }

  const profileUserLink = (userId: number) => {
    return '/profile/'+userId;
  }

  const toContent = (content: string) => {
    const contentArray = content.split(' ');
    return <>
      <a href={profileUserLink(+contentArray[1])}>{contentArray[0]}{` #${contentArray[1]}`}</a> {contentArray.slice(2).join(' ')}
    </>
  }

  useEffect(() => {
    getListNotiMutation.mutate({ page: 1, pageSize: 10 });
  }, []);

  return (
    <StyledDrawner 
      open={isOpen} 
      onClose={onClose}
      closeIcon={false}
    >
      <div className="header">Notifications</div>
      <Divider />
      <div className="search-box">
        <div
          id="scrollableDiv"
          style={{
            height: 'calc(100vh - 150px)',
            overflow: 'auto',
            padding: '0 16px',
            margin: '20px 0 0 0',
            border: '1px solid rgba(140, 140, 140, 0.35)',
          }}
        >
          <InfiniteScroll
            dataLength={listNoti.length}
            next={handleGetMore}
            hasMore={listNoti.length < total}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
             <List
              dataSource={listNoti}
              renderItem={(item) => (
                <List.Item key={item.notiId}>
                  <List.Item.Meta
                    title={toContent(item.content)}
                    description={item.create_at.slice(0, 16).replace('T', ' ')}
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

export default NotificationsDrawner;
