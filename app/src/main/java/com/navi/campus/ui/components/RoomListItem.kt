package com.navi.campus.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.navi.campus.model.Room
import com.navi.campus.ui.theme.NaviSurface
import com.navi.campus.ui.theme.NaviSurfaceVariant
import com.navi.campus.ui.theme.NaviTextMuted
import com.navi.campus.ui.theme.NaviTextPrimary
import com.navi.campus.ui.theme.NaviTextSecondary

@Composable
fun RoomListItem(room: Room, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .background(NaviSurface, RoundedCornerShape(16.dp))
            .padding(14.dp),
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(44.dp)
                .background(NaviSurfaceVariant, RoundedCornerShape(12.dp)),
        ) {
            Icon(
                imageVector = room.icon,
                contentDescription = null,
                tint = NaviTextSecondary,
            )
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text(
                text = room.name,
                color = NaviTextPrimary,
                style = MaterialTheme.typography.titleMedium,
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = room.floor,
                    color = NaviTextMuted,
                    style = MaterialTheme.typography.bodySmall,
                )
                Text(
                    text = "  ·  ",
                    color = NaviTextMuted,
                    style = MaterialTheme.typography.bodySmall,
                )
                CategoryBadge(category = room.category)
            }
        }

        Icon(
            imageVector = Icons.Filled.ChevronRight,
            contentDescription = null,
            tint = NaviTextMuted,
        )
    }
}
