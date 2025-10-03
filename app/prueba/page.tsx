import {getClient} from '../lib/cliente'
import {gql} from '@apollo/client';

async function loadData(){
    const {data} = await getClient().query({
        query: gql`
            query GetLatestPosts {
  posts(first: 20, where: {status: PUBLISH}) {
    nodes {
      id
      title
      content
    }
  }
}
`,
});
return data.posts.nodes;
}

async function PagePrueba() {
  const posts = await loadData();
    await loadData()
  
    return(
    <div className='m-9'>
        {posts.map((post) => (
            <div key={post.id}>
                <h6 className="p-16">
                {post.title}
                </h6>
                <h4>
                {post.content.p}
                </h4>
            </div>
        ))}
    </div>
  );
}
export default PagePrueba;