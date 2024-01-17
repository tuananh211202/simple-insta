import { useMutation } from "react-query";
import { HomePageContainer } from "./style";
import { PostApi } from "../../midleware/api";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Card, Divider, List, Skeleton } from "antd";
import { CommentOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../midleware/api/constants";

type PostType = {
  postId: number;
  create_at: string;
  imageUrl: string;
  description: string;
  mode: string;
  comment: {commentId: number}[];
  reacts: {reactId: number}[];
  owner: {
    userId: number;
    name: string;
    avatar: string;
  }
};

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);

  const getPostsMutation = useMutation(PostApi.getPosts, {
    onSuccess: (data, variables) => {
      console.log(data, variables);
      if (variables.page === 1) {
        setPosts([
          ...posts,
          ...data
        ]);
      }
    }
  });

  const handleGetMore = () => {
    getPostsMutation.mutate({ page: page + 1, pageSize: 10 });
    setPage(page + 1);
  }

  useEffect(() => {
    getPostsMutation.mutate({ page: 1, pageSize: 10 });
  }, []);

  return (
    <HomePageContainer>
      <div
        id="scrollableDiv"
        style={{
          width: '50%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={1}
          next={handleGetMore}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List 
            dataSource={posts}
            split={false}
            renderItem={(item) => (
              <List.Item key={item.postId}>
                <Card
                  style={{ width: '100%' }}
                  cover={
                    <img
                      alt="example"
                      src={`${BASE_URL}/image/${item.imageUrl}`}
                      style={{ width: '100%', aspectRatio: 1 }}
                    />
                  }
                  actions={[
                    <HeartOutlined key='react' style={{ fontSize: '24px' }} />,
                    <CommentOutlined key='comment' style={{ fontSize: '24px' }} />,
                  ]}
                >
                  <Card.Meta 
                    avatar={<Avatar size={56} icon={<UserOutlined />} src={!item.owner.avatar.length ? undefined : `${BASE_URL}/image/${item.owner.avatar}`} />}
                    title={item.owner.name}
                    description={item.description.length ? item.description : ' asdsa'}
                  />
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </HomePageContainer>
  )
}

export default HomePage;