import { Divider, TextField } from "@material-ui/core";
import React from "react";
import {
	CustomButton,
	CustomDialog,
	CustomDialogContent,
	CustomDialogFooter,
	CustomDialogHeader,
	CustomIconButton,
	CustomTable,
	CustomTableBody,
	CustomTableCell,
	CustomTableContainer,
	CustomTableHead,
	CustomTableRow,
	icon
} from "../../../common/components";
import styles from "./ParticipantsDialog.module.css";
const ParticipantsDialog = ({
	selectedGroup,
	onCloseInfo,
	data,
	onCickUser,
	messages,
	user,
	newMessage = "",
	onWrite,
	onSend,
	onDeleteMessage
}) => {
	return (
		<CustomDialog open={!!selectedGroup} onClose={onCloseInfo}>
			<CustomDialogHeader>Group participants</CustomDialogHeader>
			<CustomDialogContent dividers className={styles.dialog}>
				<CustomTableContainer className={styles.table}>
					<CustomTable stickyHeader dense>
						<CustomTableHead>
							<CustomTableRow>
								<CustomTableCell header>Name</CustomTableCell>
								<CustomTableCell className={styles["column--20"]} header>
									Height
								</CustomTableCell>
								<CustomTableCell className={styles["column--20"]} header>
									Weight
								</CustomTableCell>
								<CustomTableCell className={styles["column--last"]} header />
							</CustomTableRow>
						</CustomTableHead>
						<CustomTableBody>
							{console.log(data)}
							{Array.isArray(data) &&
								selectedGroup &&
								data.map((participant) => (
									<CustomTableRow key={participant._id}>
										<CustomTableCell>{participant.fullName}</CustomTableCell>
										<CustomTableCell className={styles["column--20"]}>{`${
											participant.height ? participant.height + " cm" : "-"
										}`}</CustomTableCell>
										<CustomTableCell className={styles["column--20"]}>{`${
											participant.weight ? participant.weight + " kg" : "-"
										}`}</CustomTableCell>
										<CustomTableCell className={styles["column--last"]}>
											{selectedGroup.ownerId === user._id && user._id !== participant._id && (
												<CustomIconButton
													color="var(--color-red)"
													onClick={() => onCickUser(selectedGroup._id, participant._id)}
													icon={icon.faUserMinus}
												/>
											)}
										</CustomTableCell>
									</CustomTableRow>
								))}
						</CustomTableBody>
					</CustomTable>
				</CustomTableContainer>
				{Array.isArray(messages) && messages.length > 0 && (
					<div className={styles.messages}>
						{messages.map((message) => (
							<div key={message._id}>
								<div
									className={`${styles.messages__message} ${
										user._id === message.writerId && styles["messages__message--my"]
									}`}
								>
									<span className={styles.message__message}>{message?.content}</span>
									<span className={styles.message__writer}>{message?.writer}</span>
									{user._id === message.writerId && (
										<span className={styles.messages__delete}>
											<CustomButton
												className={styles.messages__deleteButton}
												onClick={() => onDeleteMessage(message._id)}
												color="red"
											>
												Delete
											</CustomButton>
										</span>
									)}
								</div>
								<Divider />
							</div>
						))}
					</div>
				)}
				<div className={styles.message}>
					<TextField
						className={styles.newMessage}
						value={newMessage}
						onChange={(event) => onWrite(event)}
						InputProps={{ disableUnderline: true }}
						placeholder="Write your message"
					/>
					<CustomIconButton onClick={onSend} icon={icon.faPaperPlane} color="var(--color-darkgreen)" />
				</div>
			</CustomDialogContent>
			<CustomDialogFooter>
				<CustomButton color="green" onClick={onCloseInfo}>
					Close
				</CustomButton>
			</CustomDialogFooter>
		</CustomDialog>
	);
};

export default ParticipantsDialog;
