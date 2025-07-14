import { Button, TextareaAutosize } from "@mui/material";
import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import { CommentModel } from "@/app/types/Workout.types";
import { fetchComments, fetchNewComment } from "@/app/requests/fetchs";
import Loading from "@/app/components/Loading/Loading";
import Comment from "@/app/components/Comments/Comment";
import AcceptCancel from "@/app/components/AcceptCancel";

type CommentsListProps = {
    workoutId: string;
    close: () => void;
}

export default function CommentsList({ workoutId, close } : CommentsListProps) {
    const [loading, setLoading] = useState<string | boolean>('Loading comments');
    const [submitting, setSubmitting] = useState(false);

    const [newComment, setNewComment] = useState('');

    const [comments, setComments] = useState<CommentModel[]>([]);

    async function loadComments() {
        try {
            const data = await fetchComments(workoutId);
            setComments(data);
        } catch (err) {
            alert(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
    }, []);

    async function handleNewComment() {
        try {
            setLoading('Submitting Comment');
            setSubmitting(true);
            const newId = await fetchNewComment(newComment, workoutId);
            setLoading('Loading comments');
            await loadComments();
            // remove after api 
            setComments(prev => [
                ...prev,
                {
                    owner: localStorage.getItem('username') || '',
                    comment: newComment,
                    id: newId,
                    ownerId: '-1'
                }
            ]);
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
                    loading ? <Loading>{loading}</Loading> :
                    comments.map((comment) => <Comment ownerId={comment.ownerId} commentId={comment.id} comment={comment} key={comment.comment + comment.id + comment.owner}/>)
                }
            </div>
        </div>
    )
}