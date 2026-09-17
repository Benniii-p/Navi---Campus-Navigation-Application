package com.navi.campus.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.navi.campus.model.Room
import com.navi.campus.model.RoomRepository
import com.navi.campus.ui.components.BottomNavBar
import com.navi.campus.ui.components.FilterChipRow
import com.navi.campus.ui.components.NaviTab
import com.navi.campus.ui.components.RoomListItem
import com.navi.campus.ui.theme.NaviAccentGreen
import com.navi.campus.ui.theme.NaviBackgroundBottom
import com.navi.campus.ui.theme.NaviSurface
import com.navi.campus.ui.theme.NaviTextMuted
import com.navi.campus.ui.theme.NaviTextPrimary
import com.navi.campus.ui.theme.NaviTextSecondary

private val filterOptions = listOf("All", "Office", "Laboratory", "Classroom")

@Composable
fun FindRoomScreen(
    onBack: () -> Unit = {},
    onRoomClick: (Room) -> Unit = {},
) {
    var query by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf(filterOptions.first()) }
    var selectedTab by remember { mutableStateOf(NaviTab.SEARCH) }

    val filteredRooms = remember(query, selectedFilter) {
        RoomRepository.rooms.filter { room ->
            val matchesFilter = selectedFilter == "All" ||
                room.category.label.equals(selectedFilter, ignoreCase = true)
            val matchesQuery = query.isBlank() ||
                room.name.contains(query, ignoreCase = true) ||
                room.floor.contains(query, ignoreCase = true)
            matchesFilter && matchesQuery
        }
    }

    Scaffold(
        containerColor = NaviBackgroundBottom,
        topBar = { CampusBadge() },
        bottomBar = {
            BottomNavBar(selected = selectedTab, onSelect = { selectedTab = it })
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(top = 8.dp, bottom = 20.dp),
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Filled.ArrowBack, contentDescription = "Back", tint = NaviTextPrimary)
                }
                Text(
                    text = "Find a Room",
                    color = NaviTextPrimary,
                    style = MaterialTheme.typography.headlineSmall,
                )
            }

            SearchField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.padding(bottom = 16.dp),
            )

            FilterChipRow(
                options = filterOptions,
                selected = selectedFilter,
                onSelect = { selectedFilter = it },
                modifier = Modifier.padding(bottom = 16.dp),
            )

            Text(
                text = "${filteredRooms.size} results found",
                color = NaviTextMuted,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(bottom = 12.dp),
            )

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 16.dp),
            ) {
                items(filteredRooms, key = { it.id }) { room ->
                    RoomListItem(room = room, onClick = { onRoomClick(room) })
                }
            }
        }
    }
}

@Composable
private fun CampusBadge() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(NaviBackgroundBottom)
            .padding(top = 12.dp, bottom = 4.dp),
        contentAlignment = Alignment.Center,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .background(NaviSurface, RoundedCornerShape(20.dp))
                .padding(horizontal = 16.dp, vertical = 8.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(NaviAccentGreen, CircleShape),
            )
            Text(
                text = "  NAVI · CvSU Cavite\n  City Campus",
                color = NaviTextSecondary,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}

@Composable
private fun SearchField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    TextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            .fillMaxWidth()
            .background(NaviSurface, RoundedCornerShape(14.dp)),
        placeholder = {
            Text("Room, department, floor...", color = NaviTextMuted)
        },
        leadingIcon = {
            Icon(Icons.Filled.Search, contentDescription = null, tint = NaviTextMuted)
        },
        singleLine = true,
        shape = RoundedCornerShape(14.dp),
        colors = TextFieldDefaults.colors(
            focusedContainerColor = NaviSurface,
            unfocusedContainerColor = NaviSurface,
            disabledContainerColor = NaviSurface,
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent,
            disabledIndicatorColor = Color.Transparent,
            cursorColor = NaviAccentGreen,
            focusedTextColor = NaviTextPrimary,
            unfocusedTextColor = NaviTextPrimary,
        ),
    )
}
