package com.navi.campus.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.navi.campus.ui.theme.NaviAccentGreen
import com.navi.campus.ui.theme.NaviBorder
import com.navi.campus.ui.theme.NaviSurfaceVariant
import com.navi.campus.ui.theme.NaviTextSecondary

@Composable
fun FilterChipRow(
    options: List<String>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(horizontal = 0.dp),
    ) {
        items(options) { option ->
            val isSelected = option == selected
            Text(
                text = option,
                color = if (isSelected) Color.Black else NaviTextSecondary,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier
                    .clickable { onSelect(option) }
                    .background(
                        color = if (isSelected) NaviAccentGreen else NaviSurfaceVariant,
                        shape = RoundedCornerShape(20.dp),
                    )
                    .border(
                        width = if (isSelected) 0.dp else 1.dp,
                        color = NaviBorder,
                        shape = RoundedCornerShape(20.dp),
                    )
                    .padding(horizontal = 16.dp, vertical = 8.dp),
            )
        }
    }
}
