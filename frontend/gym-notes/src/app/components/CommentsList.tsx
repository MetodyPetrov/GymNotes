import { Button, TextareaAutosize } from "@mui/material";
import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import { CommentModel } from "../types/Workout.types";
import { fetchComments, fetchNewComment, tempFetchComments, tempFetchNewComment } from "../requests/fetchs";
import Loading from "./Loading";
import Comment from "./Comment";
import AcceptCancel from "./AcceptCancel";

type CommentsListProps = {
    workoutId: number;
    close: () => void;
}

export default function CommentsList({ workoutId, close } : CommentsListProps) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [newComment, setNewComment] = useState('');

    const [comments, setComments] = useState<CommentModel[]>([]);

    useEffect(() => {
        async function loadComments() {
            try {
                const data = await tempFetchComments(workoutId);
                setComments(data);
            } catch (err) {
                alert(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadComments();
    }, []);

    async function handleNewComment() {
        try {
            setSubmitting(true);
            await tempFetchNewComment(newComment);
            setComments(prev => [...prev, { owner: localStorage.getItem('username') || '', comment: newComment }]);
        } catch (err) {
            alert(err);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles["comments-container"]}>
            <div className={styles["comments-container-options"]}>
                <div className={styles["new-comment-container"]}>
                    <TextareaAutosize 
                        minRows={3}
                        placeholder="What'd you think?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                            color: 'black',
                            resize: 'none',
                            width: '202px',
                            outline: 'none',
                            padding: '5px',
                            backgroundColor: submitting ? 'rgba(255, 255, 255, 0.5)' : 'white',
                            fontSize: '1rem',
                            borderRadius: '10px',
                            cursor: submitting ? 'not-allowed' : ''
                        }}
                        disabled={submitting}
                    />
                    <Button variant="outlined" sx={{
                        color: 'white',
                        fontWeight: '600',
                        backgroundColor: '#1976d2',
                        padding: '8px',
                        height: 'fit-content',
                        border: 'solid 1px white'
                    }} onClick={handleNewComment}>Comment</Button>
                </div>
                <AcceptCancel noAccept onCancel={close}/>
            </div>
            <div className={styles["comments-existing-container"]}>
                {
                    loading ? <Loading>Loading comments</Loading> :
                    comments.map((comment, index) => <Comment comment={comment} key={comment.comment + index + comment.owner}/>)
                }
            </div>
        </div>
    )
}