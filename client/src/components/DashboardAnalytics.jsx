import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashboardAnalytics() {
    const { currentUser } = useSelector((state)=> state.user)
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    useEffect(()=> {

        const fetchUsers = async ()=> {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
                if (!res.ok) {
                    console.log('fetchUsers error', data);
                }
            } catch (error) {
                console.log("users catch error",error);
            }
        }

        const fetchPosts = async ()=> {
            try {
                const res = await fetch(`/api/post/getposts?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error);
            }
        }

        const fetchComments = async ()=> {
            try {
                const res = await fetch(`/api/comment/getcomments?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }

    }, [currentUser])
  return (
    <div className="p-3 md:mx-auto">

        {/* Analytics Container */}
        <div className="flex flex-wrap gap-4 justify-center">
            {/* Users Analytics */}
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-gary-500 text-md uppercase">Total Users</h3>
                        <p className="text-2xl">{totalUsers}</p>
                    </div>
                    <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthUsers}
                    </span>
                    <div className="text-green-500">Last month</div>
                </div>
            </div>
            {/* Comments Analytics */}
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-gary-500 text-md uppercase">Total Comments</h3>
                        <p className="text-2xl">{totalComments}</p>
                    </div>
                    <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthComments}
                    </span>
                    <div className="text-green-500">Last month</div>
                </div>
            </div>
            {/* Posts Analytics */}
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-gary-500 text-md uppercase">Total Posts</h3>
                        <p className="text-2xl">{totalPosts}</p>
                    </div>
                    <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthPosts}
                    </span>
                    <div className="text-green-500">Last month</div>
                </div>
            </div>
        </div>
        
        {/* Table Container */}
        <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">

            {/* Users Table */}
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">

                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recents Users</h1>
                    <Button outline gradientDuoTone={'purpleToPink'}>
                        <Link to={'/dashboard?tab=users'}>See all</Link>
                    </Button>
                </div>

                <Table hoverable>

                    <Table.Head>
                        <Table.HeadCell>User image</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                    </Table.Head>
                    
                    {users && users.map((user)=> (
                        <Table.Body key={user._id} className="divide-y">
                            <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">

                                <Table.Cell>
                                    <img 
                                        src={user.profilePicture}
                                        alt="user"
                                        className="w-10 h-10 rounded-full bg-gray-500"
                                    />
                                </Table.Cell>
                                <Table.Cell>{user.username}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>

            {/* Comments Table */}
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">

                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recents comments</h1>
                    <Button outline gradientDuoTone={'purpleToPink'}>
                        <Link to={'/dashboard?tab=comments'}>See all</Link>
                    </Button>
                </div>

                <Table hoverable>

                    <Table.Head>
                        <Table.HeadCell>Comment content</Table.HeadCell>
                        <Table.HeadCell>Likes</Table.HeadCell>
                    </Table.Head>
                    
                    {comments && comments.map((comment)=> (
                        <Table.Body key={comment._id} className="divide-y">
                            <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">

                                <Table.Cell className="w-96">
                                    <p className="line-clamp-2">{comment.content}</p>
                                </Table.Cell>
                                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>

            {/* Posts Table */}
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">

                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recents Posts</h1>
                    <Button outline gradientDuoTone={'purpleToPink'}>
                        <Link to={'/dashboard?tab=posts'}>See all</Link>
                    </Button>
                </div>

                <Table hoverable>

                    <Table.Head>
                        <Table.HeadCell>Post image</Table.HeadCell>
                        <Table.HeadCell>Post Title</Table.HeadCell>
                        <Table.HeadCell>Post Category</Table.HeadCell>
                    </Table.Head>
                    
                    {posts && posts.map((post)=> (
                        <Table.Body key={post._id} className="divide-y">
                            <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">

                                <Table.Cell>
                                    <img 
                                        src={post.image}
                                        alt="user"
                                        className="w-14 h-10 rounded-md bg-gray-500"
                                    />
                                </Table.Cell>
                                <Table.Cell className="w-96">{post.title}</Table.Cell>
                                <Table.Cell className="w-5">{post.category}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>

        </div>
    </div>
  )
}
