import { pool } from "../../db";
import { RowDataPacket } from "mysql2/promise";

interface CreateNewGroupChatResult {
  success: boolean;
  message: string;
}

async function createNewGroupChatApi(
  chatName: string,
  userIds: string[]
): Promise<CreateNewGroupChatResult> {
  const connection = await pool.getConnection();

  try {
    // Begin the transaction
    await connection.beginTransaction();

    // Insert the new group chat
    const [groupChatResult] = await connection.query(
      "INSERT INTO group_chats (chat_name) VALUES (?)",
      [chatName]
    );

    const [groupChatIdResult] = await connection.query(
      "SELECT LAST_INSERT_ID() AS group_chat_id"
    );
    const groupChatId = (groupChatIdResult as RowDataPacket[])[0].group_chat_id;

    // Insert members into group_chat_members table
    const insertMembersPromises = userIds.map((userId) =>
      connection.query(
        "INSERT INTO group_chat_members (group_chat_id, user_id) VALUES (?, ?)",
        [groupChatId, userId]
      )
    );

    await Promise.all(insertMembersPromises);

    // Commit the transaction
    await connection.commit();

    return { success: true, message: "Group chat created successfully" };
  } catch (error) {
    // If any query fails, rollback the transaction
    await connection.rollback();

    console.error("Error creating group chat:", error);

    return { success: false, message: "Error creating group chat" };
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

export { createNewGroupChatApi };
