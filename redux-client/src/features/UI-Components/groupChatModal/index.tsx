import React, { useEffect, useState } from "react"
import {
  createNewGroupChatApi,
  getAllUsersApi,
} from "../../pages/homePage/mainAPI"
import { Link, useNavigate } from "react-router-dom"

interface GroupChatModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (selectedUsers: string[]) => void
}

interface User {
  id: string
  name: string
}

const GroupChatModal: React.FC<GroupChatModalProps> = (props) => {
  const [users, setUsers] = useState<User[]>([])
  const userRecord = JSON.parse(localStorage.getItem("userRecord") as any)
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    userRecord ? [userRecord.firstName + " " + userRecord?.lastName] : [],
  )
  const [chatName, setChatName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsersApi()
        const usersData: User[] = result.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        }))
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const createNewGroupChatHandler = async (
    chatName: string,
    selectedUsers: string[],
  ) => {
    const selectedUserIds = selectedUsers.map((userName) => {
      const user: any = users.find((u: any) => u.name === userName)
      return user ? user.id : null
    })

    const validUserIds = selectedUserIds.filter((id) => id !== null) as string[]

    try {
      await createNewGroupChatApi(chatName, validUserIds)
      // Call the onCreate prop with validUserIds
      props.onCreate(validUserIds)
    } catch (error) {
      console.error("Error creating group chat:", error)
    } finally {
      navigate("/home")
    }
  }

  const handleUserClick = (userName: string) => {
    const name = userRecord?.firstName + " " + userRecord?.lastName
    if (selectedUsers.includes(userName)) {
      if (userName !== name) {
        setSelectedUsers((prevUsers) =>
          prevUsers.filter((user) => user !== userName),
        )
      }
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, userName])
    }
  }

  return (
    <div
      className={`group-chat-modal custom-modal ${
        props.visible ? "block" : "hidden"
      }`}
    >
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h2
                    className="text-lg text-center mb-5 leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    New Group Chat
                  </h2>
                  <div className="mt-2">
                    <label className="text-gray-600">Group Chat Name:</label>
                    <input
                      value={chatName}
                      onChange={(e: any) => setChatName(e.target.value)}
                      type="text"
                      className="mt-1 p-2 w-full bg-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label className="text-gray-600 ml-6">Select Users:</label>
              <div className="flex flex-wrap gap-2 mt-1 bg-gray-100 p-2 rounded">
                {" "}
                {users.map((user: User) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      handleUserClick(user.name)
                    }}
                    className={`p-2 cursor-pointer border rounded ${
                      selectedUsers.includes(user.name)
                        ? "bg-teal-300"
                        : "bg-black"
                    }`}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={() =>
                  createNewGroupChatHandler(chatName, selectedUsers)
                }
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-teal-400 shadow-sm px-4 py-2 bg-teal-400 text-base font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create Group Chat
              </button>
              <button
                onClick={props.onClose}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-teal-800 shadow-sm px-4 py-2 bg-teal-800 text-base font-medium text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-800 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupChatModal
