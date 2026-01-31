package ai.penguin.android.ui

import androidx.compose.runtime.Composable
import ai.penguin.android.MainViewModel
import ai.penguin.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
