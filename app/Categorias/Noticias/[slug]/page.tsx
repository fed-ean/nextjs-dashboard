import { getServerSideClient } from '@/app/lib/server-cliente';
import { gql } from '@apollo/client';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      title
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PostData = {
  post: {
    title: string;
    content: string;
    date: string;
    author: {
      node: {
        name: string;
      };
    };
    featuredImage?: {
      node?: {
        sourceUrl?: string;
        altText?: string;
      };
    };
  } | null;
};

async function getPost(slug: string) {
  const client = getServerSideClient();

  try {
    const { data } = await client.query<PostData>({
      query: GET_POST_BY_SLUG,
      variables: { id: slug },
    });

    return data?.post ?? null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post?.title ?? 'Post Not Found',
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <article className="prose lg:prose-xl mx-auto p-4">
      <h1>{post.title}</h1>

      {post.featuredImage?.node?.sourceUrl && (
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.featuredImage.node.altText || post.title}
          width={800}
          height={400}
          className="w-full h-auto object-cover rounded-lg"
          priority
        />
      )}

      <div className="text-sm text-gray-500 mt-2 mb-4">
        By {post.author.node.name} on{' '}
        {new Date(post.date).toLocaleDateString()}
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
