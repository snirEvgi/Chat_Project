import { useEffect, useState } from "react"
import {
  createNewGroupChatApi,
  getAllUsersApi,
} from "../../pages/homePage/mainAPI"

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
  const [users, setUsers] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [chatName, setChatName] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsersApi()
        const usersData: User[] = result.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        }))
        setUsers(usersData as any)
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
      await createNewGroupChatApi(chatName, selectedUsers)
    } catch (error) {
      console.error("Error creating group chat:", error)
    }
  }

  return (
    <div className={`group-chat-modal ${props.visible ? "block" : "hidden"}`}>
      <div className="text-black fixed inset-0 overflow-y-auto">
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
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Group Chat
                  </h3>
                  <div className="mt-2">
                    <label className="text-gray-600">Group Chat Name:</label>
                    <input
                      value={chatName}
                      onChange={(e: any) => setChatName(e.target.value)}
                      type="text"
                      className="mt-1 p-2 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label className="text-gray-600">Select Users:</label>
              <select
                multiple
                value={selectedUsers}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  )
                  setSelectedUsers(selectedOptions)
                }}
                className="mt-1 p-2 w-full"
              >
                {users.map((user: any, index) => (
                  <option key={index} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
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
                className="mt-3 w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                <span className="inline-block align-middle">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupChatModal
