import { INotiRealtime } from "noti.interface";

const sendNotiToUser = async (to_user_id: number, noti: INotiRealtime) => {
  const clients = await global.wsServerGlob.fetchSockets();
  // remove redudant if noti have more fields than needed
  const sendNoti: INotiRealtime = {
    content: noti.content,
    from_user: {
      username: noti.from_user.username,
    },
  };
  clients.forEach((client) => {
    if (client.data.user.id === to_user_id) {
      client.emit("newNoti", sendNoti);
    }
  });
};

export default { sendNotiToUser };
