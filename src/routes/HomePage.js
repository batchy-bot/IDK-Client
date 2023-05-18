import { useState, useEffect, useRef } from 'react';
import './route_styles/HomePage.css';
import axios from 'axios';
import moment from 'moment';

// const serverURL = 'http://localhost:3001'
const serverURL = 'https://idk-server-git-main-batchy-bot.vercel.app'

export default function HomePage() {

    return (
        <div id="HomePage" className='route-page'>
            <NewsFeed />
        </div>
    )
}




function NewsFeed() {

    const [posts, setPosts] = useState([]);
    const [isPostModalVisible, setIsPostModalVisible] = useState(false);
    const [isNFLoading, setIsNFLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);
    const [isPostLoading, setIsPostLoading] = useState(false);

    async function updatePosts() {
        try {
            const response = await axios.get(serverURL + '/posts');
            setPosts(response.data);
            setIsNFLoading(false);
        } catch (err) {
            console.log(err);
            setIsNFLoading(false);
        }
    }


    useEffect(() => {
        updatePosts()

    }, [])

    function handleClickOutside() {
        setIsPostModalVisible(false);
    }


    async function addNewPost(post_text) {

        const newPost = {
            name: 'Anonymous',
            post: post_text,
            likes: 0,
            comments: [],
            upload_date: new Date()
        }

        setIsPostLoading(true);

        try {
            await axios.post(serverURL + '/add_post', newPost)
                .then(async res => await updatePosts())
                .then(res => setIsPostLoading(false));
        } catch (err) {
            setIsPostLoading(false);
            console.log(err);
            return err
        }

    }


    async function handleDeletePost(_id) {
        console.log(String(_id));
        await axios.delete(serverURL + '/delete_post/' + _id)
            .then(response => {
                console.log(response.data); // Data deleted successfully
            })
            .catch(error => {
                console.error(error); // Handle error
            });

        updatePosts()
    }

    return (
        <div id='NewsFeed'>
            <div id='new-post-input' >
                <input type='text' placeholder="What's on your mind?" onClick={() => setIsPostModalVisible(true)} disabled={isPostModalVisible} />
                <div id='new-post-loading'>{isPostLoading && <h5>Posting...</h5>}</div>
            </div>
            <div id='posts-container'>
                {
                    isNFLoading ? <h1 id='nf-loading-text'>Loading Feed...</h1> : (posts && posts.length > 0 && isOnline) ? (
                        posts.map(post => {
                            return <Post
                                uploadDate={post.upload_date}
                                _id={post._id}
                                name={post.name}
                                post={post.post}
                                comments={post.comments}
                                likes={post.likes}
                                handleDeletePost={handleDeletePost}
                            />
                        })
                    )
                        : (isOnline) ? <h2 id='newsfeed-no-post'>No Posts on this Feed</h2>
                            : <h2 id='newsfeed-no-post'>Check your Internet Connection</h2>
                }



            </div>
            {
                !isNFLoading && <p id='newsfeed-end-text' >End of your News Feed</p>
            }

            {
                isPostModalVisible && <NewPostModal
                    handleClickOutside={handleClickOutside}
                    addNewPost={addNewPost}
                />
            }

        </div>
    )
}

function NewPostModal({ handleClickOutside, addNewPost }) {

    const [isButtonActive, setIsButtonActive] = useState(false);

    function isValidPost(text) {
        function isAllSpaces(str) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] !== " ") {
                    return false;
                }
            }
            return true;
        }
        if (text && text !== '' && !isAllSpaces(text)) {
            return true
        }
    }

    function newPostObject(text) {
        return text
    }

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <div id='new-post-modal' onClick={e => {
            if (e.target.id == 'new-post-modal') handleClickOutside();
        }}>
            <div id='new-post-modal-form'>
                <h5>Create Anonymous Post</h5>
                <textarea ref={inputRef} type='text' placeholder="What's on your mind?" onChange={(e) => {
                    if (isValidPost(e.target.value)) {
                        setIsButtonActive(true);
                    } else {
                        setIsButtonActive(false);
                    }
                }} onKeyDown={e => {
                    if (e.key === 'Enter') {
                        addNewPost(newPostObject(e.target.value));
                        handleClickOutside()
                    }
                }} />
                <button className={isButtonActive && 'button-active'} onClick={e => {
                    addNewPost(newPostObject(e.target.parentElement.querySelector('textarea').value));
                    handleClickOutside();
                }} disabled={!isButtonActive}>Post</button>
            </div>
        </div>
    )
}

/** Post */
function Post({ addedClass, uploadDate, _id, name, post, comments, likes, handleDeletePost }) {

    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const [commentsState, setCommentsState] = useState(comments);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);

    function commentClicked() {
        if (isCommentVisible) {
            setIsCommentVisible(false);
        } else {
            setIsCommentVisible(true);
        }
    }

    function sendComment(text) {
        function isAllSpaces(str) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] !== " ") {
                    return false;
                }
            }
            return true;
        }
        if (text && text !== '' && !isAllSpaces(text)) {
            setCommentsState([...commentsState, text])
        }
    }

    const handleKeyPress = (event) => {

        if (event.key === 'Enter') {
            // Enter key was pressed
            sendComment(event.target.value)
            event.target.value = ''
            // Perform your desired action here
        }
    };


    const optionRef = useRef(null);
    const postRef = useRef(null);


    function isValidText(text) {
        function isAllSpaces(str) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] !== " ") {
                    return false;
                }
            }
            return true;
        }
        if (text && text !== '' && !isAllSpaces(text)) {
            return true
        }
    }

    return (
        <div className={addedClass + ' post'} ref={postRef}>
            <div className='post-name'>
                <div className='post-author-container'>
                    <h5>{name}</h5>
                    <p>{moment(uploadDate).fromNow()}</p>
                </div>
                <div className='post-options-btn' onClick={() => {
                    if (isOptionsVisible) {
                        setIsOptionsVisible(false);
                    } else {
                        setIsOptionsVisible(true)
                    }
                }}>
                    ...
                </div>
                {
                    isOptionsVisible &&
                    (<div ref={optionRef} className='post-options'>
                        <div className='post-option' onClick={e => {
                            postRef.current.classList.add('deleting-post')
                            handleDeletePost(_id)
                        }}>Delete</div>
                        <div className='post-option'>Turn on notifications for this post</div>
                    </div>)
                }
            </div>
            <h6 className='post-post'>
                <span>{post}</span>
            </h6>
            <div className='post-data-info'>
                <div className='post-data-likes'>
                    <h5>{likes} Likes</h5>
                </div>
                <div className='post-data-comments-share'>
                    <h5>
                        {commentsState.length}
                        {(commentsState.length > 1) ? ' Comments' : ' Comment'}
                    </h5>
                </div>
            </div>
            <div className='post-buttons'>
                <button>Like</button>
                <button onClick={commentClicked}>Comment</button>
                <button>Share</button>
            </div>

            {
                isCommentVisible && (
                    <div>
                        <div className='post-comments-container'>
                            {
                                (commentsState.length > 0) && (
                                    commentsState.map(comment => {
                                        return (
                                            <div className='user-comment-container'>
                                                <div className='commenter-profile'></div>
                                                <div className='user-comment-content'>
                                                    <h3>Anonymous</h3>
                                                    <h5>{comment}</h5>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>

                        <div className='post-comment-input' onKeyDown={handleKeyPress}>
                            <div className='post-comment-input-profile' />
                            <input type="text" placeholder='Write a comment...'></input>


                            <button onClick={e => {
                                sendComment(e.target.parentElement.querySelector('input').value)
                                e.target.parentElement.querySelector('input').value = ''
                            }}>
                                Send
                            </button>
                        </div>
                    </div>
                )
            }


        </div>
    )
}
