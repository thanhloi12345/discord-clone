import { deleteAMemberById } from "@/src/api/servers";
import { useDeleteServerById } from "@/src/hooks/useLoadServers";
import useListServersStore from "@/src/store/create-list-server-store";
import useServerStore from "@/src/store/server-store";
import { Member, Profile } from "@/src/types/type";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Button, Pressable } from "react-native";
import Modal from "react-native-modal";

const DeleteMemberModal = ({
  isVisible,
  onClose,
  member,
  profile,
}: {
  isVisible: boolean;
  onClose: () => void;
  member: Member;
  profile: Profile;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (!member || !profile) return;
    setLoading(true);
    await deleteAMemberById(member.id, member.serverId);
    onClose();
    setLoading(false);
    router.push("/server/list-member");
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View className="flex-1 justify-center items-center">
        <View className="w-full rounded-xl gap-6 p-4 bg-[#1c1d22]">
          <Text className="text-white text-lg font-semibold">Xóa máy chủ</Text>
          <Text className="text-grayColor text-sm font-semibold">
            Bạn có chắc muốn xóa thành viên{" "}
            <Text className="text-white text-sm font-bold">
              {profile?.name}
            </Text>
            ?. Hành đông này không thể hoàn tác
          </Text>
          <View className="gap-2 w-full">
            <Pressable
              onPress={handleDelete}
              disabled={loading}
              className="w-full py-3 justify-center items-center rounded-full bg-[#da373c]"
            >
              <Text className="text-white font-semibold text-lg">Có</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              disabled={loading}
              className="w-full py-3 justify-center items-center rounded-full bg-[#373a43]"
            >
              <Text className="text-white font-semibold text-lg">Không</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteMemberModal;
