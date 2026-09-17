package com.navi.campus.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.navi.campus.R;
import com.navi.campus.data.RoomItem;

import java.util.ArrayList;
import java.util.List;

public class RoomAdapter extends RecyclerView.Adapter<RoomAdapter.RoomViewHolder> {

    public interface OnRoomClickListener {
        void onRoomClick(RoomItem room);
    }

    private final List<RoomItem> rooms = new ArrayList<>();
    private final OnRoomClickListener listener;

    public RoomAdapter(OnRoomClickListener listener) {
        this.listener = listener;
    }

    public void submitList(List<RoomItem> newRooms) {
        rooms.clear();
        rooms.addAll(newRooms);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RoomViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_room, parent, false);
        return new RoomViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RoomViewHolder holder, int position) {
        RoomItem room = rooms.get(position);
        holder.bind(room, listener);
    }

    @Override
    public int getItemCount() {
        return rooms.size();
    }

    static class RoomViewHolder extends RecyclerView.ViewHolder {

        private final ImageView imageIcon;
        private final TextView textName;
        private final TextView textFloor;
        private final TextView textCategory;

        RoomViewHolder(@NonNull View itemView) {
            super(itemView);
            imageIcon = itemView.findViewById(R.id.imageRoomIcon);
            textName = itemView.findViewById(R.id.textRoomName);
            textFloor = itemView.findViewById(R.id.textRoomFloor);
            textCategory = itemView.findViewById(R.id.textRoomCategory);
        }

        void bind(RoomItem room, OnRoomClickListener listener) {
            imageIcon.setImageResource(room.getIconRes());
            textName.setText(room.getName());
            textFloor.setText(room.getFloor());

            textCategory.setText(room.getCategory().getLabel());
            textCategory.setBackgroundResource(room.getCategory().getBadgeBackgroundRes());
            textCategory.setTextColor(
                    itemView.getContext().getColor(room.getCategory().getBadgeTextColorRes()));

            itemView.setOnClickListener(v -> listener.onRoomClick(room));
        }
    }
}
