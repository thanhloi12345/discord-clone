import { View, Text, FlatList } from "react-native";
import React, { useMemo, useState } from "react";
import ServerItem from "./server-item";
import AddServerButton from "./add-server-button";
import { useServers } from "../../hooks/useLoadServers";
import { Server } from "../../types/type";
import useServerStore from "../../store/server-store";
import JoinServerButton from "./join-server-button";

const ListServer = () => {
  const { selectedServer, selectServer } = useServerStore();
  const { servers, loading } = useServers();
  const onHandleSelect = (id: string) => {
    selectServer(id);
  };

  return (
    <FlatList
      style={{
        width: "100%",
      }}
      showsVerticalScrollIndicator={false}
      data={servers}
      renderItem={({ item }) => {
        return (
          <ServerItem
            item={item}
            isSelected={item.id === selectedServer}
            onPress={onHandleSelect}
          />
        );
      }}
      keyExtractor={(item: Server) => item.id}
      contentContainerStyle={{
        gap: 10,
        paddingBottom: 50,
      }}
      ListFooterComponent={
        <>
          <View className="w-full items-center mb-[10px]">
            <AddServerButton />
          </View>
          <View className="w-full items-center">
            <JoinServerButton />
          </View>
        </>
      }
    />
  );
};

export default ListServer;
