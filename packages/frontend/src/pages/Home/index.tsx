import { useMutation } from "react-query";
import { HomePageContainer } from "./style";
import { PostApi } from "../../midleware/api";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Card, Divider, List, Skeleton } from "antd";
import { CommentOutlined, HeartFilled, HeartOutlined, UserOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../midleware/api/constants";
import Cookies from "js-cookie";
import { useModal } from "../../context/modal-context";

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
  const [change, setChange] = useState(0);
  const currentUser = JSON.parse(Cookies.get('user') ?? '');
  const { dispatch } = useModal();

  const getPostsMutation = useMutation(PostApi.getPosts, {
    onSuccess: (data, variables) => {
      console.log(data, variables);
      if (variables.page === 1) setPosts([...data])
      else {
        setPosts([
          ...posts,
          ...data
        ]);
      }
    }
  });

  const reactMutation = useMutation(PostApi.reactPost, {
    onSuccess: () => {
      setChange(change+1);
    }
  });

  const unReactMutation = useMutation(PostApi.unReactPost, {
    onSuccess: () => {
      setChange(change+1);
    }
  })

  const handleGetMore = () => {
    getPostsMutation.mutate({ page: page + 1, pageSize: 10 });
    setPage(page + 1);
  }

  const profileUserLink = (userId: number) => {
    return '/profile/'+userId;
  }

  const handleReact = (postId: number) => {
    reactMutation.mutate(postId);
  }

  const handleUnReact = (postId: number) => {
    unReactMutation.mutate(postId);
  }

  useEffect(() => {
    getPostsMutation.mutate({ page: 1, pageSize: 10 });
  }, [change]);

  const ReactIcon = (hasReact: boolean, postId: number) => {
    return hasReact ? <HeartFilled key='react' style={{ fontSize: '24px' }} onClick={() => handleUnReact(postId)} /> : <HeartOutlined key='react' style={{ fontSize: '24px' }} onClick={() => handleReact(postId)} />;
  }

  const handleOpenPost = (postId: number) => {
    dispatch({ type: 'OPEN_POST_MODAL', payload: { postId } });
  }

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
            renderItem={(item: PostType) => (
              <List.Item key={item.postId} style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  style={{ 
                    width: '96%',
                    boxShadow: '0 0 4px rgba(0, 0, 0, 0.5)',
                    border: 'none',
                  }}
                  cover={
                    <img
                      alt="example"
                      src={`${BASE_URL}/image/${item.imageUrl}`}
                      style={{ width: '100%' }}
                    />
                  }
                  actions={[
                    ReactIcon(item.reacts.includes(currentUser.userId), item.postId),
                    <CommentOutlined key='comment' onClick={() => handleOpenPost(item.postId)} style={{ fontSize: '24px' }} />,
                  ]}
                >
                  <Card.Meta 
                    avatar={<Avatar size={56} icon={<UserOutlined />} src={!item.owner.avatar.length ? undefined : `${BASE_URL}/image/${item.owner.avatar}`} />}
                    title={<a href={profileUserLink(+item.owner.userId)}>{item.owner.name}</a>}
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