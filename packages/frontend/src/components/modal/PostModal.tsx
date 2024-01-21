import { Avatar, Button, Card, Divider, Flex, Input, Modal, Space } from "antd";
import { useModal } from "../../context/modal-context";
import { useMutation, useQuery } from "react-query";
import { PostApi } from "../../midleware/api";
import { BASE_URL } from "../../midleware/api/constants";
import { CommentOutlined, HeartFilled, HeartOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import Cookies from "js-cookie";

export const PostModal = () => {
  const { state, dispatch } = useModal();
  const [comment, setComment] = useState('');
  const currentUser = JSON.parse(Cookies.get('user') ?? '');

  const handleCancel = () => {
    dispatch({ type: 'CLOSE_POST_MODAL' });
  }

  const { data: post, refetch } = useQuery(['getPostDetails', state.postId],() => PostApi.getPostDetails(state.postId));

  const commentLPostMutation = useMutation(PostApi.commentPost, {
    onSuccess: () => {
      refetch();
      setComment('');
    }
  });

  const isReact = post?.reacts.includes(currentUser.userId);

  const actionMutation = useMutation(!isReact ? () => PostApi.reactPost(post?.postId) : () => PostApi.unReactPost(post?.postId), {
    onSuccess: () => {
      refetch();
    }
  });

  const profileUserLink = (userId: number) => {
    return '/profile/'+userId;
  }

  return (
    <Modal
      open={state.isPostModalOpen}
      onCancel={handleCancel}
      centered
      width={'100vw'}
      footer={false}
    >
      <div style={{ height: '90vh' }}>
        <Flex style={{ width: '100%', height: '100%' }} justify="space-between">
          <Space style={{ height: '100%', width: '40%', position: 'relative' }} direction="vertical">
              <Flex style={{ marginBottom: '10px' }}>
                <Avatar size={48} icon={<UserOutlined />} src={!post?.owner.avatar.length ? undefined : `${BASE_URL}/image/${post?.owner.avatar}`} />
                <div style={{ marginLeft: '10px' }}>
                  <a style={{ fontSize: '18px', lineHeight: 1 }} href={profileUserLink(+post?.owner.userId)}>{post?.owner.name}{` #${post?.owner.userId}`}</a>
                  <p style={{ margin: 0, lineHeight: 1, marginTop: '10px', fontWeight: 300 }}>{post?.create_at.slice(0, 16).replace('T', ' ')}</p>
                </div>
              </Flex>
              <img 
                src={!post?.imageUrl.length ? undefined : `${BASE_URL}/image/${post?.imageUrl}`} 
                style={{
                  width: 'calc(100% - 2px)',
                  height: 'auto',
                  borderRadius: '5px',
                  border: 'solid',
                  borderWidth: '1px'
                }}
              />
              <p style={{ margin: 0, marginTop: '10px' }}>{post?.description}</p>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'end' }}>
                <p style={{ fontSize: '16px', margin: 0 }}>{post?.reacts.length} <HeartFilled /></p>
                <p style={{ fontSize: '16px', margin: 0 }}>{post?.comments.length} <CommentOutlined /></p>
              </div>
          </Space>
          <Divider type="vertical" style={{ height: '100%' }} />
          <div style={{ height: '100%', width: '57%', paddingRight: '16px', position: 'relative' }}>
            <div style={{ width: '100%', height: 'calc(100% - 50px)', overflowY: 'auto' }}>
              {post?.comments.map((comment) => (<>
                <Flex align="center">
                  <Avatar icon={<UserOutlined />} src={!comment.owner.avatar.length ? undefined : `${BASE_URL}/image/${comment.owner.avatar}`} />
                  <a style={{ fontSize: '16px', lineHeight: 1, marginLeft: '5px' }} href={profileUserLink(+comment.owner.userId)}>{comment.owner.name}{` #${comment.owner.userId}`}</a>
                </Flex>
                <div style={{ marginLeft: '37px', width: '85%', padding: '8px 16px', backgroundColor: '#f0f0f0', borderRadius: '10px', marginBottom: '5px' }}>
                  {comment.content}
                </div>
              </>))}
            </div>
            <div style={{ width: '100%', position: 'absolute', bottom: 0, height: '50px', display: 'flex', alignItems: 'center', backgroundColor: 'wihte' }}>
              <Space.Compact style={{ width: 'calc(100% - 16px)' }}>
                <Input value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button icon={<SendOutlined />} onClick={() => commentLPostMutation.mutate({ postId: post.postId, content: comment})}/>
                <Button icon={!isReact ? <HeartOutlined /> : <HeartFilled />} onClick={() => actionMutation.mutate()}/>
              </Space.Compact>
            </div>
          </div>
        </Flex>
      </div>
    </Modal>
  )
}