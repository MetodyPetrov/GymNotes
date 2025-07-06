import { EditNote } from "@mui/icons-material";
import { CommentModel } from "../types/Workout.types";
import styles from "./Comments.module.css";
import { TextareaAutosize, TextField } from "@mui/material";
import { useState } from "react";
import AcceptCancel from "./AcceptCancel";

type CommentProps = {
    comment: CommentModel;
}
export default function Comment({ comment }: CommentProps) {
    const [ currentComment, setCurrentComment ] = useState(comment.comment);
    const [ editText, setEditText ] = useState(false);
    const [ commentText, setCommentText ] = useState(comment.comment);

    return (
        <div className={styles["comment-container"]}>
            <div className={styles["comment"]}>
                <TextareaAutosize
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                        color: 'black',
                        resize: 'none',
                        outline: 'none',
                        padding: '5px',
                        backgroundColor: 'white',
                        fontSize: '1rem',
                        borderRadius: '10px',
                        width: '100%',
                        cursor: 'grab'
                    }}
                    readOnly
                />
                <div className={styles["comment-actions"]}>
                    {
                        comment.owner === localStorage.getItem('username') ?

                        ( editText ? 
                        
                        <button 
                            className={styles["comment-edit-button"]}
                            onClick={() => setEditText(true)}
                        >
                            <EditNote sx={{
                                    width: '25px',
                                    height: '25px'
                                }}
                            />
                        </button> :

                        <AcceptCancel />
                        
                        ) : <></>
                    }
                </div>
            </div>
            <div className={styles["comment-owner-container"]}>
                <label className={styles["comment-owner"]}>{comment.owner}</label>
            </div>
        </div>
    )
}