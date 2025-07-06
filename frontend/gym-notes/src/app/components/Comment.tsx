import { EditNote } from "@mui/icons-material";
import { CommentModel } from "../types/Workout.types";
import styles from "./Comments.module.css";
import { TextareaAutosize } from "@mui/material";
import { useState } from "react";
import AcceptCancel from "./AcceptCancel";
import { fetchEditComment, tempFetchEditComment } from "../requests/fetchs";
import { BeatLoader } from "react-spinners";

type CommentProps = {
    comment: CommentModel;
}
export default function Comment({ comment }: CommentProps) {
    const [ currentComment, setCurrentComment ] = useState(comment.comment);
    const [ editText, setEditText ] = useState(false);
    const [ commentText, setCommentText ] = useState(comment.comment);

    const [ editTextHover, setEditTextHover ] = useState(false);
    const [ editting, setEditting ] = useState(false);

    async function handleCommentSubmit() {
        try {
            setEditting(true);
            await tempFetchEditComment(commentText);
            setCurrentComment(commentText);
            console.log(commentText);
        } catch(err) {
            alert(err);
            console.error(err);
        } finally {
            setEditting(false);
            setEditText(false);
            setEditTextHover(false);
        }
    } 

    return (
        <div className={styles["comment-container"]}>
            <div className={styles["comment-actions-container"]}>
                {
                    comment.owner === localStorage.getItem('username') ?
                    <div className={styles["comment-actions"]} style={editText ? { padding: '3px 30px' } : {}}>
                        { editText ? 
                        
                            ( editting ? 

                                <BeatLoader /> : // why ts not work???

                                <AcceptCancel
                                    onCancel={() => { setEditText(false); setCommentText(currentComment); }}
                                    onAccept={handleCommentSubmit}
                                />
                            ) :

                            <button 
                                className={styles["comment-edit-button"]}
                                onClick={() => setEditText(true)}
                                onMouseEnter={() => setEditTextHover(true)}
                                onMouseLeave={() => setEditTextHover(false)}
                                style={editTextHover ? { backgroundColor: '#ffd86e', transition: '1s' } : {}}
                            >
                                <EditNote sx={{
                                        width: '30px',
                                        height: '30px',
                                        color: editTextHover || editText ? 'green' : 'black',
                                        transition: '0.2s'
                                    }}
                                />
                            </button>
                        
                        }
                    </div> : <></>
                }
            </div>
            <div className={styles["comment"]} style={{ borderRadius: comment.owner === localStorage.getItem('username') ? '20px 0px' : '' }}>
                <TextareaAutosize
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                        color: 'black',
                        resize: 'none',
                        outline: 'none',
                        padding: '5px',
                        backgroundColor: editting ? 'rgba(255, 255, 255, 0.5)' : 'white',
                        fontSize: '1rem',
                        borderRadius: '10px',
                        width: '100%',
                        cursor: editting ? 'not-allowed' : ( editText ? '' : 'grab' )
                    }}
                    readOnly={!editText}
                />
            </div>
            <div className={styles["comment-owner-container"]}>
                <label className={styles["comment-owner"]}>{comment.owner}</label>
            </div>
        </div>
    )
}