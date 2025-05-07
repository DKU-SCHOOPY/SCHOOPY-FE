import React from "react";
import styled from "styled-components";

const PostContainer = styled.div`
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 8px;
    border-radius: 8px;
  }
`;

const Image = styled.img`
  width: 100%;
  border-radius: 5px;
  object-fit: cover;
  max-height: 300px;

  @media (max-width: 600px) {
    max-height: 200px;
  }
`;

const Info = styled.div`
  margin-top: 10px;

  @media (max-width: 600px) {
    margin-top: 8px;
  }
`;
const UserName = styled.h3`
  font-size: 16px;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Location = styled.p`
  font-size: 14px;
  color: #555;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

export default function Post({ post, onDelete }) {
  return (
    <PostContainer>
      <UserName>{post.username}</UserName>
      <Location>{post.location}</Location>
      <Image src={post.imageUrl} alt="post" />
      <Info>
        <p>{post.caption}</p>
      </Info>
    </PostContainer>
  );
}